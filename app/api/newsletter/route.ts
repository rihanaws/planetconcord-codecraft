import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

// Validation schema
const newsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
})

// Simple in-memory rate limiting (replace with Redis in production)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(identifier: string, maxRequests: number = 5, windowMs: number = 24 * 60 * 60 * 1000): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)

  if (!record || now > record.resetAt) {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (record.count >= maxRequests) {
    return false
  }

  record.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()

    // Validate input
    const validationResult = newsletterSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email address",
          errors: validationResult.error.issues,
        },
        { status: 400 }
      )
    }

    const { email } = validationResult.data

    // Rate limiting - 5 requests per day per email
    if (!checkRateLimit(email, 5, 24 * 60 * 60 * 1000)) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many requests. Please try again later.",
        },
        { status: 429 }
      )
    }

    // Send welcome email via Resend
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "noreply@techsci.xyz",
        to: email,
        subject: "Welcome to TechSci CodeCraft Newsletter! 🚀",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8f9fa;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 40px 20px;">
                    <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                      <!-- Header -->
                      <tr>
                        <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px 16px 0 0;">
                          <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                            Welcome to CodeCraft! 🎉
                          </h1>
                        </td>
                      </tr>

                      <!-- Content -->
                      <tr>
                        <td style="padding: 40px;">
                          <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                            Hi there! 👋
                          </p>
                          <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                            Thank you for subscribing to the <strong>TechSci CodeCraft</strong> newsletter! We're excited to have you join our community of digital innovators.
                          </p>
                          <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                            Here's what you can expect from us:
                          </p>
                          <ul style="margin: 0 0 20px; padding-left: 20px; color: #374151; font-size: 16px; line-height: 1.8;">
                            <li>Latest product updates and releases</li>
                            <li>Exclusive tips and strategies</li>
                            <li>Special offers and early access</li>
                            <li>Industry insights and trends</li>
                          </ul>
                          <p style="margin: 0 0 30px; color: #374151; font-size: 16px; line-height: 1.6;">
                            Stay tuned for our next email, where we'll share some valuable resources to help you get started!
                          </p>

                          <!-- CTA Button -->
                          <table role="presentation" style="margin: 0 auto;">
                            <tr>
                              <td style="border-radius: 8px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                                <a href="https://codecraft.techsci.xyz/products" style="display: inline-block; padding: 14px 32px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px;">
                                  Explore Our Products
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                      <!-- Footer -->
                      <tr>
                        <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 16px 16px; border-top: 1px solid #e5e7eb;">
                          <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px; text-align: center;">
                            TechSci CodeCraft Agency
                          </p>
                          <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
                            You're receiving this email because you subscribed to our newsletter at codecraft.techsci.xyz
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>
        `,
      })
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError)
      // Continue execution even if email fails
    }

    // TODO: Store subscription in database (optional)
    // await prisma.newsletterSubscriber.create({
    //   data: { email, subscribedAt: new Date() }
    // })

    return NextResponse.json(
      {
        success: true,
        message: "Successfully subscribed to newsletter!",
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred. Please try again later.",
      },
      { status: 500 }
    )
  }
}
