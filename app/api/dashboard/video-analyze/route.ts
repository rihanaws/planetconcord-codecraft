import { NextResponse } from "next/server"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/db/prisma"
import { z } from "zod"
import OpenAI from "openai"

const createAnalysisSchema = z.object({
  videoUrl: z
    .string()
    .url("Must be a valid URL")
    .refine(
      (url) => /youtube\.com|youtu\.be|vimeo\.com/.test(url),
      { message: "URL must be a YouTube or Vimeo link" }
    ),
  notes: z.string().optional(),
})

const SYSTEM_PROMPT = `You are a real estate video analysis expert. Given a video URL, produce JSON with this exact shape:
{
  "qualityScore": <number 0-100>,
  "engagementScore": <number 0-100>,
  "recommendations": [
    { "category": "<one of: Lighting, Framing, Pacing, Audio, CTA, SEO>", "tip": "<specific actionable tip>" }
  ]
}
Rules:
- At least one tip per category (6 minimum recommendations).
- Be specific and actionable for real estate property videos.
- qualityScore reflects production quality (lighting, framing, audio, editing).
- engagementScore reflects how likely viewers are to watch till end and take action.
- Return ONLY valid JSON, no markdown, no extra text.`

export async function POST(request: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Access gate: must have ACTIVE access to realestate-ai-video-review
  const product = await prisma.product.findUnique({ where: { slug: "realestate-ai-video-review" } })
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }

  const access = await prisma.productAccess.findFirst({
    where: { userId: session.user.id, productId: product.id, status: "ACTIVE" },
  })
  if (!access) {
    return NextResponse.json({ error: "Active access required" }, { status: 403 })
  }

  const body: unknown = await request.json()
  const parsed = createAnalysisSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 400 })
  }

  const { videoUrl, notes } = parsed.data

  // Create row as PENDING
  const analysis = await prisma.videoAnalysis.create({
    data: {
      userId: session.user.id,
      productId: product.id,
      videoUrl,
      notes: notes || null,
      status: "PENDING",
    },
  })

  // Call OpenAI
  try {
    const client = new OpenAI()
    const userMessage = notes
      ? `Analyze this real estate video: ${videoUrl}\n\nAdditional context from the creator: ${notes}`
      : `Analyze this real estate video: ${videoUrl}`

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      response_format: { type: "json_object" },
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error("Empty response from OpenAI")
    }

    const result = JSON.parse(content) as {
      qualityScore: number
      engagementScore: number
      recommendations: { category: string; tip: string }[]
    }

    const updated = await prisma.videoAnalysis.update({
      where: { id: analysis.id },
      data: {
        status: "COMPLETE",
        qualityScore: result.qualityScore,
        engagementScore: result.engagementScore,
        recommendations: result.recommendations,
      },
    })

    return NextResponse.json(updated)
  } catch (err) {
    await prisma.videoAnalysis.update({
      where: { id: analysis.id },
      data: { status: "FAILED" },
    })

    console.error("OpenAI error:", err)
    return NextResponse.json(
      { error: "Analysis failed", analysisId: analysis.id },
      { status: 500 }
    )
  }
}
