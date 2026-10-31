"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "@/lib/navigation";

/** A top-layer modal avoids the sticky header's backdrop-filter containing block. */
export default function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const destinationRef = useRef<string | null>(null);
  const pathname = usePathname();
  const previousPath = useRef(pathname);

  useEffect(() => {
    if (previousPath.current !== pathname) {
      previousPath.current = pathname;
      onClose();
    }
  }, [pathname, onClose]);

  useEffect(() => {
    if (!open) return;
    const desktop = window.matchMedia("(min-width: 1024px)");
    if (desktop.matches) { onClose(); return; }
    const opener = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const dialog = dialogRef.current;
    dialog?.showModal();
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const handleResize = () => { if (desktop.matches) onClose(); };
    desktop.addEventListener("change", handleResize);
    return () => {
      desktop.removeEventListener("change", handleResize);
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      if (opener instanceof HTMLElement && opener.isConnected && opener.getClientRects().length) {
        opener.focus({ preventScroll: true });
      } else {
        document.getElementById("main-content")?.focus({ preventScroll: true });
      }
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open || destinationRef.current !== pathname) return;
    const frame = requestAnimationFrame(() => {
      document.getElementById("main-content")?.focus();
      destinationRef.current = null;
    });
    return () => cancelAnimationFrame(frame);
  }, [open, pathname]);

  function navigate(event: MouseEvent<HTMLAnchorElement>, href: string) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    destinationRef.current = href;
    onClose();
  }

  if (!open) return null;
  return (
    <dialog ref={dialogRef} aria-label="Site navigation"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const controls = dialogRef.current?.querySelectorAll<HTMLElement>("button, a[href]");
        if (!controls?.length) return;
        const first = controls[0]; const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault(); last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); first.focus();
        }
      }}
      className="fixed inset-0 m-0 h-[100dvh] max-h-none w-full max-w-none border-0 bg-transparent p-0 text-inherit backdrop:bg-ink/40">
      <div className="absolute inset-0" aria-hidden="true" onClick={onClose} />
      <div className="absolute inset-y-0 left-0 flex w-[85%] max-w-xs flex-col bg-paper shadow-xl dark:bg-paper-dark">
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-line px-4 dark:border-line-dark">
          <span className="text-sm font-semibold">Contents</span>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close navigation menu" className="flex h-10 w-10 items-center justify-center rounded-sm text-ink-soft hover:bg-green-50 dark:text-[#A8B3AC] dark:hover:bg-line-dark">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <nav className="min-h-0 flex-1 overflow-y-auto px-4 py-4" aria-label="Documentation sections">
          <NavTree pathname={pathname} onNavigate={navigate} />
        </nav>
      </div>
    </dialog>
  );
}

/** Shared with the desktop sidebar, which does not need modal behaviour. */
export function NavTree({ pathname, onNavigate }: {
  pathname: string;
  onNavigate?: (event: MouseEvent<HTMLAnchorElement>, href: string) => void;
}) {
  return (
    <ul className="space-y-6">
      {navigation.map((section) => (
        <li key={section.title}>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-mute dark:text-[#8FA097]">{section.title}</h3>
          <ul className="space-y-0.5 border-l border-line dark:border-line-dark">
            {section.items.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link href={item.href} onClick={(event) => onNavigate?.(event, item.href)} aria-current={active ? "page" : undefined}
                    className={`-ml-px block border-l-2 py-1.5 pl-3 text-sm leading-snug ${active ? "border-green-600 font-semibold text-green-700 dark:text-green-500" : "border-transparent text-ink-soft hover:border-line hover:text-ink dark:text-[#A8B3AC] dark:hover:text-white"}`}>
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
