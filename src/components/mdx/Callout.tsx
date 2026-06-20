/**
 * Callouts carry the tri-band-derived "left band" signature: a solid
 * coloured edge encoding meaning — green for notes, clay for warnings.
 * role="note" lets screen readers announce these as asides.
 */
export function Callout({
  title,
  children,
  tone = "note",
}: {
  title?: string;
  children: React.ReactNode;
  tone?: "note" | "warning";
}) {
  const styles =
    tone === "warning"
      ? "border-clay-600 bg-clay-50 dark:bg-[#221310]"
      : "border-green-600 bg-green-50 dark:bg-[#101A14]";
  return (
    <div role="note" className={`mt-6 border-l-4 px-4 py-3 ${styles}`}>
      {title && <p className="font-semibold">{title}</p>}
      <div className="text-[15px] leading-relaxed [&>p]:mt-1 first:[&>p]:mt-0">{children}</div>
    </div>
  );
}

export function Note({ children, title = "Note" }: { children: React.ReactNode; title?: string }) {
  return (
    <Callout tone="note" title={title}>
      {children}
    </Callout>
  );
}

export function Warning({ children, title = "Warning" }: { children: React.ReactNode; title?: string }) {
  return (
    <Callout tone="warning" title={title}>
      {children}
    </Callout>
  );
}
