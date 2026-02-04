/**
 * E2E tests for authentication flows
 * Covers: login page load, signup page load, form validation,
 * navigation between auth pages, redirect behavior
 */
import { test, expect } from "@playwright/test"

test.describe("Authentication Pages", () => {
  test("login page loads and renders form elements", async ({ page }) => {
    await page.goto("/login")

    // Should render page title
    await expect(page.getByText("Welcome back")).toBeVisible()

    // Email input should be present
    const emailInput = page.getByLabel(/email/i)
    await expect(emailInput).toBeVisible()

    // Password input should be present
    const passwordInput = page.getByLabel(/password/i)
    await expect(passwordInput).toBeVisible()

    // Sign in button should be present
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible()
  })

  test("login page has link to signup", async ({ page }) => {
    await page.goto("/login")
    const signupLink = page.getByRole("link", { name: /sign up/i })
    await expect(signupLink).toBeVisible()
    await signupLink.click()
    await expect(page).toHaveURL("/signup")
  })

  test("signup page loads and renders form elements", async ({ page }) => {
    await page.goto("/signup")

    await expect(page.getByText("Create your account")).toBeVisible()

    await expect(page.getByLabel(/name/i)).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
    await expect(page.getByRole("button", { name: /create account/i })).toBeVisible()
  })

  test("signup page has link back to login", async ({ page }) => {
    await page.goto("/signup")
    const loginLink = page.getByRole("link", { name: /sign in/i })
    await expect(loginLink).toBeVisible()
    await loginLink.click()
    await expect(page).toHaveURL("/login")
  })

  test("login form shows validation error for invalid email", async ({ page }) => {
    await page.goto("/login")

    await page.getByLabel(/email/i).fill("not-an-email")
    await page.getByLabel(/password/i).fill("anything")
    await page.getByRole("button", { name: /sign in/i }).click()

    // Should show email validation error
    await expect(page.getByText(/invalid email/i)).toBeVisible()
  })

  test("signup form shows validation errors for weak password", async ({ page }) => {
    await page.goto("/signup")

    await page.getByLabel(/name/i).fill("Test User")
    await page.getByLabel(/email/i).fill("test@example.com")
    await page.getByLabel(/password/i).fill("weak")
    await page.getByRole("button", { name: /create account/i }).click()

    // Should show password length error
    await expect(page.getByText(/at least 8 characters/i)).toBeVisible()
  })

  test("forgot password page loads correctly", async ({ page }) => {
    await page.goto("/forgot-password")

    await expect(page.getByText(/forgot password/i)).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByRole("button", { name: /send/i })).toBeVisible()
  })

  test("forgot password has link back to login", async ({ page }) => {
    await page.goto("/forgot-password")
    const loginLink = page.getByRole("link", { name: /back to login/i })
    await expect(loginLink).toBeVisible()
    await loginLink.click()
    await expect(page).toHaveURL("/login")
  })
})
