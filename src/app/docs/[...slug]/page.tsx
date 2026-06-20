import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { getAllDocs, getDocBySlug } from "@/lib/docs";
import { allNavItems } from "@/lib/navigation";
import { site } from "@/lib/site";
import Sidebar from "@/components/Sidebar";
import TableOfContents from "@/components/TableOfContents";
import { mdxComponents } from "@/components/mdx";

interface Props {
  params: { slug: string[] };
}

/** Pre-render every documentation page at build time. */
export function generateStaticParams() {
  return getAllDocs().map((doc) => ({ slug: doc.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const doc = getDocBySlug(params.slug);
  if (!doc) return {};
  return {
    title: doc.title,
    description: doc.description,
    alternates: { canonical: doc.href },
    openGraph: {
      title: doc.title,
      description: doc.description,
      url: `${site.url}${doc.href}`,
      type: "article",
    },
  };
}

export default async function DocPage({ params }: Props) {
  const doc = getDocBySlug(params.slug);
  if (!doc) notFound();

  const { content } = await compileMDX({
    source: doc.content,
    components: mdxComponents,
  });

  // Prev/next pagination from the curated navigation order
  const flatIndex = allNavItems.findIndex((item) => item.href === doc.href);
  const prev = flatIndex > 0 ? allNavItems[flatIndex - 1] : undefined;
  const next =
    flatIndex >= 0 && flatIndex < allNavItems.length - 1
      ? allNavItems[flatIndex + 1]
      : undefined;
  const section = allNavItems[flatIndex]?.section;

  // Structured data: each guidance page is a TechArticle
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: doc.title,
    description: doc.description,
    url: `${site.url}${doc.href}`,
    isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
  };

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 px-4 sm:px-6 lg:grid-cols-[16rem_minmax(0,1fr)] xl:grid-cols-[16rem_minmax(0,1fr)_14rem]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Sidebar />

      <main id="main-content" className="min-w-0 py-8 lg:px-10 lg:py-10">
        <article className="mx-auto max-w-content">
          {section && (
            <p className="text-xs font-semibold uppercase tracking-wider text-green-700 dark:text-green-500">
              {section}
            </p>
          )}
          <h1 className="mt-2 font-display text-4xl leading-tight sm:text-5xl">
            {doc.title}
          </h1>
          {doc.description && (
            <p className="mt-4 text-lg leading-relaxed text-ink-soft dark:text-[#A8B3AC]">
              {doc.description}
            </p>
          )}
          <div className="mt-2">{content}</div>

          {/* Prev / next pagination */}
          <nav
            aria-label="Previous and next pages"
            className="mt-16 grid gap-4 border-t border-line pt-6 sm:grid-cols-2 dark:border-line-dark"
          >
            {prev ? (
              <Link
                href={prev.href}
                className="group rounded-sm border border-line p-4 hover:border-green-600 dark:border-line-dark"
              >
                <span className="text-xs text-ink-mute dark:text-[#8FA097]">← Previous</span>
                <span className="mt-1 block font-semibold group-hover:text-green-700 dark:group-hover:text-green-500">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <span aria-hidden="true" />
            )}
            {next && (
              <Link
                href={next.href}
                className="group rounded-sm border border-line p-4 text-right hover:border-green-600 dark:border-line-dark"
              >
                <span className="text-xs text-ink-mute dark:text-[#8FA097]">Next →</span>
                <span className="mt-1 block font-semibold group-hover:text-green-700 dark:group-hover:text-green-500">
                  {next.title}
                </span>
              </Link>
            )}
          </nav>

          <p className="mt-8 text-sm text-ink-mute dark:text-[#8FA097]">
            Spotted a problem with this page?{" "}
            <a
              href={`${site.github}/edit/main/content/docs/${doc.slug.join("/")}.mdx`}
              className="font-medium text-green-700 underline underline-offset-4 dark:text-green-500"
            >
              Suggest an edit on GitHub
            </a>
            .
          </p>
        </article>
      </main>

      <TableOfContents headings={doc.headings} />
    </div>
  );
}
