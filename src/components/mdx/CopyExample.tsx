/**
 * A block for quoting interface copy verbatim — a heading, body text,
 * or button label as it would appear in a product. The mono face and
 * bordered frame signal "this is the artefact itself".
 */
export function CopyExample({
  label = "Example copy",
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="mt-6 border border-line bg-white dark:border-line-dark dark:bg-[#101A14]">
      <figcaption className="border-b border-line bg-green-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-ink-mute dark:border-line-dark dark:bg-line-dark dark:text-[#8FA097]">
        {label}
      </figcaption>
      <div className="px-4 py-4 font-mono text-sm leading-relaxed [&>p]:mt-2 first:[&>p]:mt-0">
        {children}
      </div>
    </figure>
  );
}
