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
