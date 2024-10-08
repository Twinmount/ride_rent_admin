// generate blog url
export function generateBlogHref(title: string): string {
  return title
    .trim() // Remove leading/trailing spaces
    .toLowerCase() // Convert to lowercase
    .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens and spaces
    .replace(/\s*-\s*/g, '-') // Replace spaces around hyphens with a single hyphen
    .replace(/\s+/g, '-') // Replace remaining spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple consecutive hyphens with a single one
}
