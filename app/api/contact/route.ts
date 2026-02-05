import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { Resend } from "resend"
import { verifyRecaptcha } from "@/lib/recaptcha"

const resend = new Resend(process.env.RESEND_API_KEY)

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(5),
  message: z.string().min(20),
  recaptchaToken: z.string(),
})

// Simple rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(identifier: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)

  if (!record || now > record.resetAt) {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + 60 * 60 * 1000 }) // 1 hour
    return true
  }

  if (record.count >= 3) return false
  record.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validationResult = contactSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, message: "Invalid input", errors: validationResult.error.issues },
        { status: 400 }
      )
    }

    const { name, email, subject, message, recaptchaToken } = validationResult.data

    // Verify reCAPTCHA
    const recaptcha = await verifyRecaptcha(recaptchaToken, "CONTACT")
    if (!recaptcha.success) {
      return NextResponse.json(
        { success: false, message: recaptcha.error || "Security check failed" },
        { status: 403 }
      )
    }

    if (!checkRateLimit(email)) {
      return NextResponse.json(
        { success: false, message: "Too many requests. Please try again later." },
        { status: 429 }
      )
    }

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "noreply@techsci.xyz",
      to: process.env.CONTACT_EMAIL || "support@techsci.xyz",
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    })

    return NextResponse.json({ success: true, message: "Message sent successfully!" })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json(
      { success: false, message: "Failed to send message" },
      { status: 500 }
    )
  }
}
