/**
 * Do / Don't example cards — the workhorse pattern of the guide.
 *
 * Each card pairs a coloured band and a text label ("Do" / "Don't"), so
 * meaning never relies on colour alone (WCAG 1.4.1 Use of Colour).
 * Example copy is set in the mono face so it reads as a quotable
 * interface string, not prose.
 */
export function DoDont({ children }: { children: React.ReactNode }) {
  return <div className="mt-6 grid gap-4 md:grid-cols-2">{children}</div>;
}

function Card({
  kind,
  label,
  children,
}: {
  kind: "do" | "dont";
  label?: string;
  children: React.ReactNode;
}) {
  const isDo = kind === "do";
  return (
    <div
      className={`flex flex-col border-t-4 ${
        isDo ? "border-green-600" : "border-clay-600"
      } bg-white shadow-sm dark:bg-[#101A14]`}
    >
      <p
        className={`px-4 pt-3 text-xs font-bold uppercase tracking-wider ${
          isDo ? "text-green-700 dark:text-green-500" : "text-clay-700 dark:text-[#E08B6A]"
        }`}
      >
        {label ?? (isDo ? "Do" : "Don't")}
      </p>
      <div className="px-4 pb-4 pt-2 text-[15px] leading-relaxed [&_p]:mt-2 first:[&_p]:mt-0 [&_code]:font-mono">
        {children}
      </div>
    </div>
  );
}

export function Do({ children, label }: { children: React.ReactNode; label?: string }) {
  return <Card kind="do" label={label}>{children}</Card>;
}

export function Dont({ children, label }: { children: React.ReactNode; label?: string }) {
  return <Card kind="dont" label={label}>{children}</Card>;
}
