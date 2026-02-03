/**
 * Formatting utility functions
 * Pure functions with no external dependencies
 */

/**
 * Format price for display
 * @param price - Price in dollars
 * @param pricingType - ONE_TIME or SUBSCRIPTION
 * @returns Formatted price string
 */
export function formatPrice(price: number, pricingType: string): string {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);

  if (pricingType === "SUBSCRIPTION") {
    return `${formatted}/month`;
  }

  return formatted;
}
