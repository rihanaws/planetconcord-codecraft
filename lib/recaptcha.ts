/**
 * Server-side reCAPTCHA Enterprise verification.
 * Calls Google's assessment API and returns the risk score.
 */

interface RecaptchaAssessment {
  name: string
  event: {
    token: string
    siteKey: string
    expectedAction?: string
  }
  riskAnalysis: {
    score: number
    reasons?: string[]
  }
}

export async function verifyRecaptcha(
  token: string,
  action: string,
  scoreThreshold: number = 0.5
): Promise<{ success: boolean; score?: number; error?: string }> {
  const apiKey = process.env.RECAPTCHA_API_KEY
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

  if (!apiKey || !siteKey) {
    console.error("reCAPTCHA env vars missing: RECAPTCHA_API_KEY or NEXT_PUBLIC_RECAPTCHA_SITE_KEY")
    // Fail open in dev so forms still work without the key configured
    if (process.env.NODE_ENV === "development") return { success: true }
    return { success: false, error: "Security check misconfigured" }
  }

  try {
    const url = `https://recaptchaenterprise.googleapis.com/v1/projects/shining-courage-465501-i8/assessments?key=${apiKey}`

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: {
          token,
          siteKey,
          expectedAction: action,
        },
      }),
    })

    if (!res.ok) {
      const errBody = await res.text()
      console.error("reCAPTCHA assessment failed:", res.status, errBody)
      return { success: false, error: "Security check failed" }
    }

    const assessment = (await res.json()) as RecaptchaAssessment
    const score = assessment.riskAnalysis?.score ?? 0

    if (score < scoreThreshold) {
      console.warn(`reCAPTCHA low score: ${score} (action=${action}, threshold=${scoreThreshold})`)
      return { success: false, score, error: "Security check failed. Please try again." }
    }

    return { success: true, score }
  } catch (err) {
    console.error("reCAPTCHA verification error:", err)
    return { success: false, error: "Security check failed" }
  }
}
