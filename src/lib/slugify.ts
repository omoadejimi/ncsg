/**
 * Convert heading text into a URL-safe anchor id.
 * Shared by the MDX heading components and the table-of-contents
 * extractor so anchors always match.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9\u00C0-\u024F]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
