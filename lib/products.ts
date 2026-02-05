/**
 * Product utility functions
 * Helper functions for querying and managing products
 */

import { cache } from "react";
import { prisma } from "@/lib/db/prisma";
import type { Product } from "@prisma/client";

/**
 * Get all products from the database
 * @returns Array of all products
 */
export const getAllProducts = cache(async (): Promise<Product[]> => {
  try {
    const products = await prisma.product.findMany({
      orderBy: [
        { featured: "desc" }, // Featured products first
        { popular: "desc" }, // Then popular products
        { createdAt: "desc" }, // Then newest
      ],
    });

    return products;
  } catch (error) {
    console.error("Error fetching all products:", error);
    return [];
  }
});

/**
 * Get a single product by its slug
 * @param slug - Product slug (URL-safe identifier)
 * @returns Product or null if not found
 */
export const getProductBySlug = cache(async (
  slug: string
): Promise<Product | null> => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
    });

    return product;
  } catch (error) {
    console.error(`Error fetching product with slug ${slug}:`, error);
    return null;
  }
});

/**
 * Get featured products (for homepage display)
 * @param limit - Maximum number of products to return (default: 3)
 * @returns Array of featured products
 */
export const getFeaturedProducts = cache(async (limit: number = 3): Promise<Product[]> => {
  try {
    const products = await prisma.product.findMany({
      where: {
        featured: true,
      },
      orderBy: [
        { popular: "desc" },
        { createdAt: "desc" },
      ],
      take: limit,
    });

    return products;
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
});

/**
 * Get products by category
 * @param category - Product category (marketing, analytics, development)
 * @returns Array of products in the specified category
 */
export async function getProductsByCategory(
  category: string
): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        category: {
          equals: category,
        },
      },
      orderBy: [
        { popular: "desc" },
        { createdAt: "desc" },
      ],
    });

    return products;
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    return [];
  }
}

/**
 * Search products by name or description
 * @param query - Search query string
 * @returns Array of matching products
 */
export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
            },
          },
          {
            description: {
              contains: query,
            },
          },
          {
            shortDesc: {
              contains: query,
            },
          },
        ],
      },
      orderBy: [
        { popular: "desc" },
        { createdAt: "desc" },
      ],
    });

    return products;
  } catch (error) {
    console.error(`Error searching products with query "${query}":`, error);
    return [];
  }
}

/**
 * Get product with its content items (for customer access)
 * @param productId - Product ID
 * @returns Product with content items or null
 */
export async function getProductWithContent(productId: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        contentItems: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    return product;
  } catch (error) {
    console.error(`Error fetching product ${productId} with content:`, error);
    return null;
  }
}

/**
 * Get popular products (based on purchase count or popular flag)
 * @param limit - Maximum number of products to return (default: 6)
 * @returns Array of popular products
 */
export async function getPopularProducts(limit: number = 6): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        popular: true,
      },
      orderBy: [
        { featured: "desc" },
        { createdAt: "desc" },
      ],
      take: limit,
    });

    return products;
  } catch (error) {
    console.error("Error fetching popular products:", error);
    return [];
  }
}

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

/**
 * Get product categories with counts
 * @returns Array of categories with product counts
 */
export async function getCategoriesWithCounts() {
  try {
    const categories = await prisma.product.groupBy({
      by: ["category"],
      _count: {
        category: true,
      },
      orderBy: {
        category: "asc",
      },
    });

    return categories;
  } catch (error) {
    console.error("Error fetching category counts:", error);
    return [];
  }
}
