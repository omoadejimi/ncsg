"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "@/lib/navigation";

/**
 * Mobile/tablet navigation drawer.
 *
 * Accessibility:
 * - role="dialog" + aria-modal so screen readers treat it as modal
 * - Escape closes; focus moves to the close button on open and is
 *   trapped within the drawer while open
 * - Body scroll is locked while the drawer is open
 * - Closes automatically on route change
 */
export default function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  // Close when the route changes (user tapped a link)
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panelRef.current) {
        // Minimal focus trap: cycle within the drawer
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])'
        );
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop — clicking it closes the drawer */}
      <div
        className="absolute inset-0 bg-ink/40"
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        className="absolute inset-y-0 left-0 flex w-[85%] max-w-xs flex-col overflow-y-auto bg-paper shadow-xl dark:bg-paper-dark"
      >
        <div className="flex h-14 items-center justify-between border-b border-line px-4 dark:border-line-dark">
          <span className="text-sm font-semibold">Contents</span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="flex h-10 w-10 items-center justify-center rounded-sm text-ink-soft hover:bg-green-50 dark:text-[#A8B3AC] dark:hover:bg-line-dark"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex-1 px-4 py-4" aria-label="Documentation sections">
          <NavTree pathname={pathname} />
        </nav>
      </div>
    </div>
  );
}

/** Shared between the mobile drawer and the desktop sidebar. */
export function NavTree({ pathname }: { pathname: string }) {
  return (
    <ul className="space-y-6">
      {navigation.map((section) => (
        <li key={section.title}>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-mute dark:text-[#8FA097]">
            {section.title}
          </h3>
          <ul className="space-y-0.5 border-l border-line dark:border-line-dark">
            {section.items.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`-ml-px block border-l-2 py-1.5 pl-3 text-sm leading-snug ${
                      active
                        ? "border-green-600 font-semibold text-green-700 dark:text-green-500"
                        : "border-transparent text-ink-soft hover:border-line hover:text-ink dark:text-[#A8B3AC] dark:hover:text-white"
                    }`}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </li>
      ))}
    </ul>
  );
}
