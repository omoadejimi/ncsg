import Link from "next/link";
import { slugify } from "@/lib/slugify";
import { Callout, Note, Warning } from "./Callout";
import { DoDont, Do, Dont } from "./DoDont";
import { CopyExample } from "./CopyExample";
import { Example } from "./Example";

/**
 * MDX component map.
 *
 * Headings generate their own anchor ids with the same slugify function
 * used by the table-of-contents extractor, so deep links always work —
 * no rehype plugins required. Each heading carries a hover anchor link.
 */

function textOf(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(textOf).join("");
  if (children && typeof children === "object" && "props" in (children as any)) {
    return textOf((children as any).props.children);
  }
  return "";
}

function AnchorHeading({
  as: Tag,
  children,
  className,
}: {
  as: "h2" | "h3";
  children: React.ReactNode;
  className: string;
}) {
  const id = slugify(textOf(children));
  return (
    <Tag id={id} className={`group scroll-mt-24 ${className}`}>
      {children}
      <a
        href={`#${id}`}
        aria-label={`Link to section: ${textOf(children)}`}
        className="ml-2 text-green-600 opacity-0 transition-opacity focus:opacity-100 group-hover:opacity-100"
      >
        #
      </a>
    </Tag>
  );
}

export const mdxComponents = {
  h1: (props: any) => (
    <h1 className="font-display text-4xl leading-tight" {...props} />
  ),
  h2: ({ children }: any) => (
    <AnchorHeading as="h2" className="mt-12 border-b border-line pb-2 text-2xl font-semibold dark:border-line-dark">
      {children}
    </AnchorHeading>
  ),
  h3: ({ children }: any) => (
    <AnchorHeading as="h3" className="mt-8 text-lg font-semibold">
      {children}
    </AnchorHeading>
  ),
  p: (props: any) => <p className="mt-4 leading-relaxed" {...props} />,
  a: ({ href = "", ...props }: any) =>
    href.startsWith("/") ? (
      <Link
        href={href}
        className="font-medium text-green-700 underline underline-offset-4 hover:text-green-600 dark:text-green-500"
        {...props}
      />
    ) : (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-green-700 underline underline-offset-4 hover:text-green-600 dark:text-green-500"
        {...props}
      />
    ),
  ul: (props: any) => <ul className="mt-4 list-disc space-y-2 pl-6" {...props} />,
  ol: (props: any) => <ol className="mt-4 list-decimal space-y-2 pl-6" {...props} />,
  li: (props: any) => <li className="leading-relaxed" {...props} />,
  strong: (props: any) => <strong className="font-semibold" {...props} />,
  blockquote: (props: any) => (
    <blockquote
      className="mt-4 border-l-2 border-green-600 pl-4 italic text-ink-soft dark:text-[#A8B3AC]"
      {...props}
    />
  ),
  // Tables get horizontal scroll on small screens instead of breaking layout
  table: (props: any) => (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  th: (props: any) => (
    <th
      className="border-b-2 border-line px-3 py-2 text-left font-semibold dark:border-line-dark"
      scope="col"
      {...props}
    />
  ),
  td: (props: any) => (
    <td className="border-b border-line px-3 py-2 align-top dark:border-line-dark" {...props} />
  ),
  code: (props: any) => (
    <code
      className="rounded-sm bg-green-50 px-1.5 py-0.5 font-mono text-[0.9em] dark:bg-line-dark"
      {...props}
    />
  ),
  pre: (props: any) => (
    <pre
      className="mt-4 overflow-x-auto rounded-sm border border-line bg-white p-4 font-mono text-sm leading-relaxed dark:border-line-dark dark:bg-[#101A14]"
      {...props}
    />
  ),
  hr: () => <div className="mt-12 h-1 w-16 triband" aria-hidden="true" />,
  // Custom documentation components available in every MDX file
  Callout,
  Note,
  Warning,
  DoDont,
  Do,
  Dont,
  CopyExample,
  Example,
};
