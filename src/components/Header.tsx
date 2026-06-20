"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import Search, { type SearchRecord } from "./Search";
import MobileNav from "./MobileNav";
import { site } from "@/lib/site";

/**
 * Sticky global header. On mobile the search control collapses to an
 * icon and the navigation moves into a drawer; all triggers keep a
 * minimum 40px tap target.
 */
export default function Header({ searchIndex }: { searchIndex: SearchRecord[] }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // "/" opens search from anywhere (skipped while typing in a field) —
  // a familiar shortcut from GitHub and GOV.UK-style documentation sites.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const typing = ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
      if (e.key === "/" && !typing) {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur-sm dark:border-line-dark dark:bg-paper-dark/95">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-4 sm:px-6">
        {/* Mobile menu trigger — first so it's reachable quickly by thumb */}
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={menuOpen}
          className="-ml-2 flex h-10 w-10 items-center justify-center rounded-sm text-ink-soft hover:bg-green-50 lg:hidden dark:text-[#A8B3AC] dark:hover:bg-line-dark"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <Logo />

        <div className="ml-auto flex items-center gap-1">
          {/* Wide search affordance on desktop, icon on mobile */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="hidden h-10 w-64 items-center gap-2 rounded-sm border border-line px-3 text-sm text-ink-mute hover:border-green-600 md:flex dark:border-line-dark dark:text-[#8FA097]"
          >
            <SearchIcon />
            <span>Search the guide</span>
            <kbd className="ml-auto rounded-sm border border-line px-1.5 py-0.5 font-mono text-[11px] dark:border-line-dark">
              /
            </kbd>
          </button>
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Search the guide"
            className="flex h-10 w-10 items-center justify-center rounded-sm text-ink-soft hover:bg-green-50 md:hidden dark:text-[#A8B3AC] dark:hover:bg-line-dark"
          >
            <SearchIcon />
          </button>

          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="NCSG on GitHub (opens in a new tab)"
            className="flex h-10 w-10 items-center justify-center rounded-sm text-ink-soft hover:bg-green-50 hover:text-ink dark:text-[#A8B3AC] dark:hover:bg-line-dark"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 .5A11.5 11.5 0 0 0 .5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.54-3.87-1.54-.53-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.75 2.69 1.25 3.34.95.1-.74.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.24 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.04.77 2.1v3.11c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z" />
            </svg>
          </a>

          <ThemeToggle />
        </div>
      </div>

      <Search open={searchOpen} onClose={() => setSearchOpen(false)} index={searchIndex} />
      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4-4" />
    </svg>
  );
}
