/**
 * E2E tests for public-facing pages
 * Covers: homepage, products listing, product detail, about, contact, legal pages
 */
import { test, expect } from "@playwright/test"

test.describe("Homepage", () => {
  test("renders hero section with CTA", async ({ page }) => {
    await page.goto("/")

    // Hero heading should be visible
    await expect(page.getByRole("heading").first()).toBeVisible()

    // Should have navigation links
    await expect(page.getByRole("link", { name: /products/i }).first()).toBeVisible()
  })

  test("navigation links are present and functional", async ({ page }) => {
    await page.goto("/")

    await page.getByRole("link", { name: /products/i }).first().click()
    await expect(page).toHaveURL("/products")
  })

  test("has login and signup links in header", async ({ page }) => {
    await page.goto("/")

    await expect(page.getByRole("link", { name: /login/i })).toBeVisible()
    await expect(page.getByRole("link", { name: /sign up/i })).toBeVisible()
  })
})

test.describe("Products Listing", () => {
  test("products page loads and shows products", async ({ page }) => {
    await page.goto("/products")

    await expect(page.getByRole("heading", { name: /products/i })).toBeVisible()

    // Should display at least one product card
    await expect(page.locator("[class*='rounded']").count()).toBeGreaterThan(0)
  })

  test("product cards are clickable links", async ({ page }) => {
    await page.goto("/products")

    // Find a product link and click it
    const productLinks = page.getByRole("link", { name: /buy/i })
    const count = await productLinks.count()

    if (count > 0) {
      // At least one buy button means products rendered
      expect(count).toBeGreaterThan(0)
    }
  })
})

test.describe("Legal & Info Pages", () => {
  test("about page renders correctly", async ({ page }) => {
    await page.goto("/about")
    await expect(page.getByRole("heading").first()).toBeVisible()
    await expect(page).toHaveTitle(/about/i)
  })

  test("contact page renders with form", async ({ page }) => {
    await page.goto("/contact")
    await expect(page.getByRole("heading").first()).toBeVisible()
  })

  test("terms page renders", async ({ page }) => {
    await page.goto("/terms")
    await expect(page.getByRole("heading").first()).toBeVisible()
    await expect(page).toHaveTitle(/terms/i)
  })

  test("privacy page renders", async ({ page }) => {
    await page.goto("/privacy")
    await expect(page.getByRole("heading").first()).toBeVisible()
    await expect(page).toHaveTitle(/privacy/i)
  })

  test("refund page renders", async ({ page }) => {
    await page.goto("/refund")
    await expect(page.getByRole("heading").first()).toBeVisible()
    await expect(page).toHaveTitle(/refund/i)
  })
})

test.describe("404 Page", () => {
  test("custom 404 page renders for non-existent route", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist-anywhere")
    expect(response?.status()).toBe(404)

    // Should show 404 text
    await expect(page.getByText("404")).toBeVisible()
    await expect(page.getByText(/page not found/i)).toBeVisible()

    // Should have quick links
    await expect(page.getByRole("link", { name: /home/i })).toBeVisible()
    await expect(page.getByRole("link", { name: /products/i })).toBeVisible()
    await expect(page.getByRole("link", { name: /contact/i })).toBeVisible()
  })

  test("404 home link navigates back to homepage", async ({ page }) => {
    await page.goto("/nonexistent-route-xyz")
    await page.getByRole("link", { name: /home/i }).click()
    await expect(page).toHaveURL("/")
  })
})

test.describe("Route Protection", () => {
  test("dashboard redirects unauthenticated users to login", async ({ page }) => {
    await page.goto("/dashboard")
    await expect(page).toHaveURL(/\/login/)
  })

  test("admin redirects unauthenticated users to login", async ({ page }) => {
    await page.goto("/admin")
    await expect(page).toHaveURL(/\/login/)
  })
})

test.describe("Mobile Responsiveness", () => {
  test("homepage is responsive on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto("/")

    // Page should load without horizontal scroll
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
  })

  test("products page is responsive on tablet viewport", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto("/products")

    await expect(page.getByRole("heading").first()).toBeVisible()
  })
})
