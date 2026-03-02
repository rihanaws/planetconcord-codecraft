/**
 * Validation schemas for the application
 * Centralized Zod schemas for all validation needs
 */

import { z } from "zod";

// ===========================
// WHOP WEBHOOK SCHEMAS (V1 API)
// Event names use snake_case e.g. membership_activated, invoice_paid
// ===========================

/**
 * Base webhook event schema — passthrough allows extra fields Whop may add
 */
export const WhopWebhookBaseSchema = z.object({
  id: z.string(),
  created_at: z.string().optional(),
}).passthrough();

/**
 * invoice_paid — triggers when a payment completes successfully
 * Replaces old "payment.succeeded"
 */
export const InvoicePaidSchema = WhopWebhookBaseSchema.extend({
  type: z.literal("invoice_paid"),
  data: z.object({
    id: z.string(),                          // invoice id
    amount: z.number().optional(),
    final_amount: z.number().optional(),     // actual charged amount
    currency: z.string().optional(),
    membership_id: z.string().optional(),    // links to membership
    user_id: z.string().optional(),
    product_id: z.string().optional(),
    // customer fields may be nested under user or top-level
    customer_email: z.string().optional(),
    customer_name: z.string().optional(),
  }).passthrough(),
});

/**
 * membership_activated — triggers when access goes valid
 * Replaces old "membership.went_valid"
 */
export const MembershipActivatedSchema = WhopWebhookBaseSchema.extend({
  type: z.literal("membership_activated"),
  data: z.object({
    id: z.string(),                          // membership id
    user_id: z.string().optional(),
    product_id: z.string().optional(),
    valid_until: z.string().optional(),
    status: z.string().optional(),
  }).passthrough(),
});

/**
 * membership_deactivated — triggers when access goes invalid
 * Replaces old "membership.went_invalid"
 */
export const MembershipDeactivatedSchema = WhopWebhookBaseSchema.extend({
  type: z.literal("membership_deactivated"),
  data: z.object({
    id: z.string(),                          // membership id
    user_id: z.string().optional(),
    product_id: z.string().optional(),
    status: z.string().optional(),
  }).passthrough(),
});

/**
 * Fallback schema — accepts any other Whop event without crashing
 * (invoice_created, entry_created, setup_intent_succeeded, etc.)
 */
export const WhopUnknownEventSchema = z.object({
  type: z.string(),
  id: z.string().optional(),
}).passthrough();

/**
 * Union of all handled webhook event types
 */
export const WhopWebhookSchema = z.discriminatedUnion("type", [
  InvoicePaidSchema,
  MembershipActivatedSchema,
  MembershipDeactivatedSchema,
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
