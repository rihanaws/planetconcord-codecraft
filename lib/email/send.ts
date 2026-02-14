import { Resend } from "resend"
import { VerificationEmailTemplate } from "./templates/verification-otp"
import { WelcomeEmailTemplate } from "./templates/welcome"
import { PasswordResetEmailTemplate } from "./templates/password-reset"
import { PurchaseConfirmationEmailTemplate } from "./templates/purchase-confirmation"
import { AccessGrantedEmailTemplate } from "./templates/access-granted"
import { SubscriptionExpiringEmailTemplate } from "./templates/subscription-expiring"
import { PostPurchaseCheckinEmailTemplate } from "./templates/post-purchase-checkin"
import { RefundProcessedEmailTemplate } from "./templates/refund-processed"

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "noreply@techsci.xyz"

/**
 * Send OTP verification email
 */
export async function sendVerificationEmail(
  to: string,
  name: string,
  otp: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Verify your email - TechSci CodeCraft",
      react: VerificationEmailTemplate({ name, otp }),
    })

    if (error) {
      console.error("Failed to send verification email:", error)
      throw new Error("Failed to send verification email")
    }

    return data
  } catch (error) {
    console.error("Email sending error:", error)
    throw error
  }
}

/**
 * Send welcome email after successful signup
 */
export async function sendWelcomeEmail(to: string, name: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Welcome to TechSci CodeCraft!",
      react: WelcomeEmailTemplate({ name }),
    })

    if (error) {
      console.error("Failed to send welcome email:", error)
      throw new Error("Failed to send welcome email")
    }

    return data
  } catch (error) {
    console.error("Email sending error:", error)
    throw error
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  to: string,
  name: string,
  otp: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Reset your password - TechSci CodeCraft",
      react: PasswordResetEmailTemplate({ name, otp }),
    })

    if (error) {
      console.error("Failed to send password reset email:", error)
      throw new Error("Failed to send password reset email")
    }

    return data
  } catch (error) {
    console.error("Email sending error:", error)
    throw error
  }
}

/**
 * Send purchase confirmation email
 */
export async function sendPurchaseConfirmationEmail(
  to: string,
  name: string,
  productName: string,
  productUrl: string,
  discordInviteUrl?: string,
  amount?: string,
  orderId?: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Your purchase: ${productName}${orderId ? ` (Order #${orderId})` : ""}`,
      react: PurchaseConfirmationEmailTemplate({
        name,
        productName,
        productUrl,
        amount,
        orderId,
        discordInviteUrl,
      }),
    })

    if (error) {
      console.error("Failed to send purchase confirmation email:", error)
      throw new Error("Failed to send purchase confirmation email")
    }

    return data
  } catch (error) {
    console.error("Email sending error:", error)
    throw error
  }
}

/**
 * Send access granted email
 */
export async function sendAccessGrantedEmail(
  to: string,
  name: string,
  productName: string,
  accessUrl: string,
  accessType?: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Access granted: ${productName}`,
      react: AccessGrantedEmailTemplate({
        name,
        productName,
        accessUrl,
        accessType,
      }),
    })

    if (error) {
      console.error("Failed to send access granted email:", error)
      throw new Error("Failed to send access granted email")
    }

    return data
  } catch (error) {
    console.error("Email sending error:", error)
    throw error
  }
}

/**
 * Send subscription expiring email
 */
export async function sendSubscriptionExpiringEmail(
  to: string,
  name: string,
  productName: string,
  expiryDate: string,
  renewUrl: string,
  amount?: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Subscription expiring: ${productName}`,
      react: SubscriptionExpiringEmailTemplate({
        name,
        productName,
        expiryDate,
        renewUrl,
        amount,
      }),
    })

    if (error) {
      console.error("Failed to send subscription expiring email:", error)
      throw new Error("Failed to send subscription expiring email")
    }

    return data
  } catch (error) {
    console.error("Email sending error:", error)
    throw error
  }
}

/**
 * Send post-purchase check-in email (2 days after purchase)
 */
export async function sendPostPurchaseCheckinEmail(
  to: string,
  name: string,
  productName: string,
  productUrl: string,
  amount?: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `How's it going with ${productName}? (Quick check-in)`,
      react: PostPurchaseCheckinEmailTemplate({
        name,
        productName,
        productUrl,
        amount,
      }),
    })

    if (error) {
      console.error("Failed to send post-purchase check-in email:", error)
      throw new Error("Failed to send post-purchase check-in email")
    }

    return data
  } catch (error) {
    console.error("Email sending error:", error)
    throw error
  }
}

/**
 * Send refund processed email
 */
export async function sendRefundProcessedEmail(
  to: string,
  name: string,
  productName: string,
  amount: string,
  orderId?: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Refund Processed - $${amount} | TechSci CodeCraft`,
      react: RefundProcessedEmailTemplate({
        name,
        productName,
        amount,
        orderId,
      }),
    })

    if (error) {
      console.error("Failed to send refund processed email:", error)
      throw new Error("Failed to send refund processed email")
    }

    return data
  } catch (error) {
    console.error("Email sending error:", error)
    throw error
  }
}
