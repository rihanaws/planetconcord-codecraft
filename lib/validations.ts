/**
 * Validation schemas for the application
 * Centralized Zod schemas for all validation needs
 */

import { z } from "zod";

// ===========================
// WHOP WEBHOOK SCHEMAS
// ===========================

/**
 * Base webhook event schema
 */
export const WhopWebhookBaseSchema = z.object({
  id: z.string(),
  created_at: z.string().optional(),
});

/**
 * Payment succeeded event
 */
export const PaymentSucceededSchema = WhopWebhookBaseSchema.extend({
  type: z.literal("payment.succeeded"),
  data: z.object({
    id: z.string(),
    amount: z.number(),
    currency: z.string(),
    customer_email: z.string().email(),
    customer_name: z.string().optional(),
    product_id: z.string(),
    metadata: z
      .object({
        productSlug: z.string().optional(),
      })
      .optional(),
  }),
});

/**
 * Membership went valid event
 */
export const MembershipValidSchema = WhopWebhookBaseSchema.extend({
  type: z.literal("membership.went_valid"),
  data: z.object({
    id: z.string(),
    user_id: z.string(),
    product_id: z.string(),
    valid_until: z.string().optional(),
  }),
});

/**
 * Membership went invalid event
 */
export const MembershipInvalidSchema = WhopWebhookBaseSchema.extend({
  type: z.literal("membership.went_invalid"),
  data: z.object({
    id: z.string(),
    user_id: z.string(),
    product_id: z.string(),
  }),
});

/**
 * Payment refunded event
 */
export const PaymentRefundedSchema = WhopWebhookBaseSchema.extend({
  type: z.literal("payment.refunded"),
  data: z.object({
    id: z.string(),
    original_payment_id: z.string(),
  }),
});

/**
 * Union of all webhook event types
 */
export const WhopWebhookSchema = z.discriminatedUnion("type", [
  PaymentSucceededSchema,
  MembershipValidSchema,
  MembershipInvalidSchema,
  PaymentRefundedSchema,
]);

export type WhopWebhookEvent = z.infer<typeof WhopWebhookSchema>;

// ===========================
// USER INPUT SCHEMAS
// ===========================

/**
 * User registration schema
 */
export const UserRegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
      "Password must contain at least one special character"
    ),
});

/**
 * User login schema
 */
export const UserLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

/**
 * Email verification schema
 */
export const EmailVerificationSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

/**
 * Password reset request schema
 */
export const PasswordResetRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
});

/**
 * Password reset schema
 */
export const PasswordResetSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
      "Password must contain at least one special character"
    ),
});

/**
 * Contact form schema
 */
export const ContactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

/**
 * Newsletter signup schema
 */
export const NewsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// ===========================
// PRODUCT SCHEMAS
// ===========================

/**
 * Product filter schema
 */
export const ProductFilterSchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  sort: z.enum(["price-asc", "price-desc", "name-asc", "name-desc"]).optional(),
});

// ===========================
// TYPE EXPORTS
// ===========================

export type UserRegisterInput = z.infer<typeof UserRegisterSchema>;
export type UserLoginInput = z.infer<typeof UserLoginSchema>;
export type EmailVerificationInput = z.infer<typeof EmailVerificationSchema>;
export type PasswordResetRequestInput = z.infer<typeof PasswordResetRequestSchema>;
export type PasswordResetInput = z.infer<typeof PasswordResetSchema>;
export type ContactFormInput = z.infer<typeof ContactFormSchema>;
export type NewsletterInput = z.infer<typeof NewsletterSchema>;
export type ProductFilterInput = z.infer<typeof ProductFilterSchema>;
