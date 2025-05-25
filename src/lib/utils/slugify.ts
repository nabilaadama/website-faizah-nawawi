// src/lib/utils/slugify.ts

/**
 * Converts a string to a URL-friendly slug
 * @param text - The text to convert into a slug
 * @returns A URL-friendly slug
 */
export default function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD") // split accented characters into their base characters and diacritical marks
    .replace(/[\u0300-\u036f]/g, "") // remove diacritical marks
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // replace spaces with hyphens
    .replace(/[^\w-]+/g, "") // remove non-word characters (except hyphens)
    .replace(/--+/g, "-") // replace multiple hyphens with a single hyphen
    .replace(/^-+|-+$/g, ""); // trim hyphens from start and end
}
