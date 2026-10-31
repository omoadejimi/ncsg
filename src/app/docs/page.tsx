import Link from "next/link";

/** /docs has no index of its own — send readers to the first page. */
export default function DocsIndex() {
  // next.config.mjs performs the HTTP redirect before rendering this fallback.
  return (
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-content px-4 py-16">
      <h1 className="font-display text-4xl">Read the guide</h1>
      <p className="mt-4"><Link href="/docs/foundations/principles" className="underline">Start with the principles</Link></p>
    </main>
  );
}
