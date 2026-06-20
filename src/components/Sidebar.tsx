"use client";

import { usePathname } from "next/navigation";
import { NavTree } from "./MobileNav";

/**
 * Persistent desktop sidebar (lg+). Sticky beneath the header so the
 * navigation stays available while reading long pages.
 */
export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:block" aria-label="Documentation navigation">
      <nav className="sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto py-8 pr-6">
        <NavTree pathname={pathname} />
      </nav>
    </aside>
  );
}
