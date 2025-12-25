import { ENV } from "@/config/env.config";

// generate blog url
export function generateBlogHref(title: string): string {
  return title
    .trim() // Remove leading/trailing spaces
    .toLowerCase() // Convert to lowercase
    .replace(/[^\w\s-]/g, "") // Remove special characters except hyphens and spaces
    .replace(/\s*-\s*/g, "-") // Replace spaces around hyphens with a single hyphen
    .replace(/\s+/g, "-") // Replace remaining spaces with hyphens
    .replace(/-+/g, "-"); // Replace multiple consecutive hyphens with a single one
}

/**
 * Truncates a given text to a specified limit.
 *
 * If the text is longer than the limit, it is truncated to the limit and
 * an ellipsis (...) is appended. Otherwise, the text is returned as is.
 *
 * @param {string} text - The text to truncate.
 * @param {number} limit - The limit after which the text is truncated.
 * @returns {string} The truncated text.
 */
export const truncateText = (text: string, limit: number) => {
  if (text.length > limit) {
    return text.slice(0, limit) + "...";
  }
  return text;
};

/**
 * Extract path from full URL
 * @param url - Full URL (e.g., "https://ride.rent/ae/dubai/cars")
 * @returns Object with path and validation status
 */
export function validateAndExtractPathForRevalidation(url: string): {
  isValid: boolean;
  path: string;
  error?: string;
} {
  const baseDomain = ENV.BASE_DOMAIN;

  // Trim whitespace
  const trimmedUrl = url.trim();

  // Check if empty
  if (!trimmedUrl) {
    return {
      isValid: false,
      path: "",
      error: "URL cannot be empty",
    };
  }

  try {
    // Parse URL
    const urlObj = new URL(trimmedUrl);

    // Check if URL starts with base domain
    if (!trimmedUrl.startsWith(baseDomain)) {
      return {
        isValid: false,
        path: "",
        error: `URL must start with ${baseDomain}`,
      };
    }

    // Extract path (everything after domain)
    const path = urlObj.pathname; // e.g., "/ae/dubai/cars"

    // Validate path format (must start with /)
    if (!path.startsWith("/")) {
      return {
        isValid: false,
        path: "",
        error: "Invalid path format",
      };
    }

    // Success
    return {
      isValid: true,
      path: path,
    };
  } catch (error) {
    // Invalid URL format
    return {
      isValid: false,
      path: "",
      error: "Invalid URL format. Please paste a valid URL.",
    };
  }
}
