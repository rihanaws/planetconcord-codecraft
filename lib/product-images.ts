/**
 * Static mapping of product slugs to their promotional images.
 * Images live in /public/images/ and are served as static assets.
 */
const PRODUCT_IMAGES: Record<string, string> = {
  "email-newsletter-starter-pack": "/images/News_Letter.png",
  "landing-page-cro-boost": "/images/Landing_Page_CRO.png",
  "social-media-content-calendar": "/images/Social_Media_Content_Calendar.png",
  "growth-accelerator-package": "/images/Growth-Analytics.png",
  "realestate-ai-video-review": "/images/RealEstate_AI_Video.png",
  "shopify-speed-surge": "/images/shopify_speed_surge.png",
}

export function getProductImageUrl(slug: string): string | null {
  return PRODUCT_IMAGES[slug] ?? null
}
