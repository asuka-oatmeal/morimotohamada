"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
}

export default function TableOfContents() {
  const [items, setItems] = useState<TocItem[]>([]);

  useEffect(() => {
    const headings = document.querySelectorAll(".prose h2");
    const tocItems: TocItem[] = [];
    headings.forEach((h, i) => {
      const id = h.id || `section-${i + 1}`;
      if (!h.id) h.id = id;
      tocItems.push({ id, text: h.textContent || "" });
    });
    setItems(tocItems);
  }, []);

  if (items.length === 0) return null;

  return (
    <nav className="toc my-6">
      <div className="toc-title">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="15" y2="18" />
        </svg>
        この記事の目次
      </div>
      <ol>
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`}>{item.text}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
