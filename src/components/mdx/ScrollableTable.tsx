"use client";

import { useEffect, useRef, useState, type TableHTMLAttributes } from "react";

export function ScrollableTable(props: TableHTMLAttributes<HTMLTableElement>) {
  const ref = useRef<HTMLDivElement>(null);
  const [overflows, setOverflows] = useState(false);
  useEffect(() => {
    const region = ref.current;
    if (!region) return;
    const update = () => setOverflows(region.scrollWidth > region.clientWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(region);
    const table = region.querySelector("table");
    if (table) observer.observe(table);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className="mt-6 overflow-x-auto" tabIndex={overflows ? 0 : undefined}
      role={overflows ? "region" : undefined} aria-label={overflows ? "Scrollable table" : undefined}>
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  );
}
