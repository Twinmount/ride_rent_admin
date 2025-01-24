import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const debounce = <T extends any[]>(
  callback: (...args: T) => void,
  delay: number
) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: T) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), delay);
  };
};

/**
 * Sanitizes a string to a slug format:
 * - Converts to lower-case.
 * - Removes leading and trailing spaces.
 * - Replaces multiple spaces or hyphens with a single hyphen.
 * - Allows only letters, numbers, and hyphens.
 *
 * @param {string} input - The raw string to sanitize.
 * @returns {string} - The sanitized slug.
 */
export function sanitizeStringToSlug(input: string): string {
  return input
    .trim() // Remove leading and trailing spaces
    .toLowerCase() // Convert to lower-case
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters except spaces and hyphens
    .replace(/[\s-]+/g, "-"); // Replace multiple spaces or hyphens with a single hyphen
}

/**
 * Reverts a slug back to a readable string:
 * - Replaces hyphens with spaces.
 * - Capitalizes the first letter of each word.
 *
 * @param {string} slug - The slugified string to revert.
 * @returns {string} - The reverted, readable string.
 */
export function revertSlugToString(slug: string): string {
  return slug
    .replace(/-/g, " ") // Replace hyphens with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word
}
