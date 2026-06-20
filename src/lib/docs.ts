import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { slugify } from "./slugify";

/**
 * Filesystem-backed documentation loader.
 *
 * All reads happen at build time inside Server Components, so the
 * deployed site is fully static. Content lives in /content/docs as MDX
 * with frontmatter: title, description, and optional keywords.
 */

const DOCS_DIR = path.join(process.cwd(), "content", "docs");

export interface DocHeading {
  depth: 2 | 3;
  text: string;
  id: string;
}

export interface DocMeta {
  slug: string[]; // e.g. ["patterns", "error-messages"]
  href: string;
  title: string;
  description: string;
  keywords: string[];
  headings: DocHeading[];
}

export interface Doc extends DocMeta {
  content: string; // raw MDX body
}

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.name.endsWith(".mdx") ? [full] : [];
  });
}

/**
 * Extract h2/h3 headings from raw MDX with a regex. A custom heading
 * component (src/components/mdx) generates ids with the same slugify
 * function, so the table of contents always matches rendered anchors —
 * without needing rehype plugins.
 */
function extractHeadings(markdown: string): DocHeading[] {
  const headings: DocHeading[] = [];
  // Skip fenced code blocks so example copy is never mistaken for headings.
  const withoutCode = markdown.replace(/```[\s\S]*?```/g, "");
  const regex = /^(#{2,3})\s+(.+)$/gm;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(withoutCode)) !== null) {
    const depth = match[1].length as 2 | 3;
    const text = match[2].replace(/[*_`]/g, "").trim();
    headings.push({ depth, text, id: slugify(text) });
  }
  return headings;
}

export function getAllDocs(): Doc[] {
  if (!fs.existsSync(DOCS_DIR)) return [];
  return walk(DOCS_DIR).map((file) => {
    const raw = fs.readFileSync(file, "utf8");
    const { data, content } = matter(raw);
    const slug = path
      .relative(DOCS_DIR, file)
      .replace(/\.mdx$/, "")
      .split(path.sep);
    return {
      slug,
      href: `/docs/${slug.join("/")}`,
      title: data.title ?? slug[slug.length - 1],
      description: data.description ?? "",
      keywords: data.keywords ?? [],
      headings: extractHeadings(content),
      content,
    };
  });
}

export function getDocBySlug(slug: string[]): Doc | undefined {
  const file = path.join(DOCS_DIR, ...slug) + ".mdx";
  // Guard against path traversal in the catch-all route.
  if (!path.resolve(file).startsWith(path.resolve(DOCS_DIR))) return undefined;
  if (!fs.existsSync(file)) return undefined;
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    href: `/docs/${slug.join("/")}`,
    title: data.title ?? slug[slug.length - 1],
    description: data.description ?? "",
    keywords: data.keywords ?? [],
    headings: extractHeadings(content),
    content,
  };
}

/** Lightweight records shipped to the client-side search dialog. */
export function getSearchIndex() {
  return getAllDocs().map(({ href, title, description, keywords, headings, slug }) => ({
    href,
    title,
    description,
    keywords,
    section: slug[0],
    headings: headings.map((h) => h.text),
  }));
}
