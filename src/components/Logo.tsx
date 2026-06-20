import Link from "next/link";

/**
 * The NCSG mark: three vertical bands echoing the Nigerian flag,
 * drawn as accessible SVG with a text wordmark beside it.
 */
export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 rounded-sm"
      aria-label="Nigerian Content Style Guide — home"
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect x="0" y="0" width="6" height="22" className="fill-green-900 dark:fill-green-500" />
        <rect x="8" y="0" width="6" height="22" className="fill-line dark:fill-line-dark" />
        <rect x="16" y="0" width="6" height="22" className="fill-green-900 dark:fill-green-500" />
      </svg>
      <span className="hidden text-[15px] font-semibold leading-tight sm:block">
        Nigerian Content <span className="font-normal text-ink-mute dark:text-[#8FA097]">Style Guide</span>
      </span>
      <span className="text-[15px] font-semibold sm:hidden">NCSG</span>
    </Link>
  );
}
