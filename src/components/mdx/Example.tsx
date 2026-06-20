/** A neutral framed example block for longer illustrative content. */
export function Example({
  title = "Example",
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6 border border-line p-4 dark:border-line-dark">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-mute dark:text-[#8FA097]">
        {title}
      </h4>
      <div className="mt-2 text-[15px] leading-relaxed [&>p]:mt-2 first:[&>p]:mt-0">{children}</div>
    </section>
  );
}
