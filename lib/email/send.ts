import { Resend } from "resend"
import { VerificationEmailTemplate } from "./templates/verification-otp"
import { WelcomeEmailTemplate } from "./templates/welcome"
import { PasswordResetEmailTemplate } from "./templates/password-reset"
import { PurchaseConfirmationEmailTemplate } from "./templates/purchase-confirmation"
import { AccessGrantedEmailTemplate } from "./templates/access-granted"
import { SubscriptionExpiringEmailTemplate } from "./templates/subscription-expiring"

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
  productUrl: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Your purchase: ${productName}`,
      react: PurchaseConfirmationEmailTemplate({
        name,
        productName,
        productUrl,
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
  accessUrl: string
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
  renewUrl: string
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
