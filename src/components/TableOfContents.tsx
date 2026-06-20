"use client";

import { useEffect, useState } from "react";
import type { DocHeading } from "@/lib/docs";

/**
 * Right-hand "On this page" list. Desktop (xl) only, generated from the
 * page's h2/h3 headings, sticky while scrolling, with a scroll-spy that
 * highlights the section currently in view.
 */
export default function TableOfContents({ headings }: { headings: DocHeading[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      // Trigger when a heading enters the top quarter of the viewport
      { rootMargin: "-80px 0px -70% 0px" }
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav
      aria-label="On this page"
      className="sticky top-14 hidden max-h-[calc(100vh-3.5rem)] overflow-y-auto py-8 pl-6 xl:block"
    >
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-mute dark:text-[#8FA097]">
        On this page
      </h2>
      <ul className="space-y-1.5 text-sm">
        {headings.map((h) => (
          <li key={h.id} className={h.depth === 3 ? "pl-3" : ""}>
            <a
              href={`#${h.id}`}
              className={
                activeId === h.id
                  ? "font-semibold text-green-700 dark:text-green-500"
                  : "text-ink-soft hover:text-ink dark:text-[#A8B3AC] dark:hover:text-white"
              }
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
