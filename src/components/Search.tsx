"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export interface SearchRecord {
  href: string;
  title: string;
  description: string;
  keywords: string[];
  section: string;
  headings: string[];
}

/**
 * Documentation search dialog.
 *
 * Approach: the entire index (titles, descriptions, headings, keywords)
 * is built server-side at build time and shipped as props — appropriate
 * for a static documentation site of this size, with zero network
 * requests per keystroke. If the guide grows past a few hundred pages,
 * swap this for Pagefind without changing the UI.
 *
 * Accessibility:
 * - role="dialog" + aria-modal, Escape to close
 * - Combobox pattern: aria-activedescendant tracks the highlighted
 *   result while focus stays in the input, so screen readers announce
 *   each result as you arrow through
 * - Results count announced via a visually hidden live region
 */
export default function Search({
  open,
  onClose,
  index,
}: {
  open: boolean;
  onClose: () => void;
  index: SearchRecord[];
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelected(0);
      // Move focus into the dialog
      requestAnimationFrame(() => inputRef.current?.focus());
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return index
      .map((record) => {
        const title = record.title.toLowerCase();
        const haystack = [
          record.title,
          record.description,
          record.section,
          ...record.keywords,
          ...record.headings,
        ]
          .join(" ")
          .toLowerCase();
        let score = 0;
        if (title === q) score += 100;
        else if (title.startsWith(q)) score += 50;
        else if (title.includes(q)) score += 30;
        if (haystack.includes(q)) score += 10;
        return { record, score };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((r) => r.record);
  }, [query, index]);

  function go(href: string) {
    onClose();
    router.push(href);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, results.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    }
    if (e.key === "Enter" && results[selected]) {
      e.preventDefault();
      go(results[selected].href);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-ink/40" aria-hidden="true" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search the guide"
        className="absolute inset-x-0 top-0 mx-auto mt-0 w-full max-w-xl bg-paper shadow-xl sm:mt-20 sm:rounded-md dark:bg-paper-dark"
      >
        <div className="flex items-center gap-3 border-b border-line px-4 dark:border-line-dark">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="shrink-0 text-ink-mute">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4-4" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls="search-results"
            aria-activedescendant={results[selected] ? `result-${selected}` : undefined}
            aria-label="Search the guide"
            placeholder="Search guidance, e.g. error messages, BVN, currency"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected(0);
            }}
            onKeyDown={onKeyDown}
            className="h-14 w-full bg-transparent text-base outline-none placeholder:text-ink-mute"
          />
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm border border-line px-2 py-1 text-xs text-ink-mute hover:text-ink dark:border-line-dark dark:hover:text-white"
          >
            Esc
          </button>
        </div>

        {/* Screen-reader announcement of result count */}
        <p className="sr-only" aria-live="polite">
          {query ? `${results.length} results` : ""}
        </p>

        <ul id="search-results" role="listbox" aria-label="Search results" className="max-h-[60vh] overflow-y-auto p-2">
          {results.map((record, i) => (
            <li
              key={record.href}
              id={`result-${i}`}
              role="option"
              aria-selected={i === selected}
            >
              <button
                type="button"
                onClick={() => go(record.href)}
                onMouseEnter={() => setSelected(i)}
                className={`block w-full rounded-sm px-3 py-3 text-left ${
                  i === selected ? "bg-green-50 dark:bg-line-dark" : ""
                }`}
              >
                <span className="block text-sm font-semibold">
                  <Highlight text={record.title} query={query} />
                </span>
                <span className="mt-0.5 block text-xs text-ink-mute dark:text-[#8FA097]">
                  {record.section} · <Highlight text={record.description} query={query} />
                </span>
              </button>
            </li>
          ))}

          {query && results.length === 0 && (
            <li className="px-3 py-8 text-center text-sm text-ink-soft dark:text-[#A8B3AC]">
              <p className="font-semibold">No results for "{query}"</p>
              <p className="mt-1">
                Try a different word, or check the sections in the navigation.
              </p>
            </li>
          )}

          {!query && (
            <li className="px-3 py-6 text-sm text-ink-mute dark:text-[#8FA097]">
              Start typing to search every page. Use ↑ ↓ to move and Enter to open.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

/** Wraps query matches in <mark> for visible highlighting. */
function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark>{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}
