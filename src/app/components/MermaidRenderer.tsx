"use client";

import { useEffect } from "react";

export default function MermaidRenderer() {
  useEffect(() => {
    async function renderMermaid() {
      const mermaid = (await import("mermaid")).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: "base",
        themeVariables: {
          primaryColor: "#e8f0fe",
          primaryBorderColor: "#1e3a5f",
          primaryTextColor: "#1e3a5f",
          lineColor: "#1e3a5f",
          secondaryColor: "#fff8e1",
          tertiaryColor: "#f3e5f5",
        },
      });

      const elements = document.querySelectorAll("pre > code.language-mermaid");
      for (const el of elements) {
        const pre = el.parentElement;
        if (!pre) continue;

        const code = el.textContent || "";
        const altText = pre.getAttribute("data-alt") || "図解";

        const wrapper = document.createElement("figure");
        wrapper.className = "my-8";
        wrapper.setAttribute("role", "img");
        wrapper.setAttribute("aria-label", altText);

        const diagramDiv = document.createElement("div");
        diagramDiv.className =
          "flex justify-center overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-4";

        const id = `mermaid-${Math.random().toString(36).slice(2, 8)}`;
        try {
          const { svg } = await mermaid.render(id, code);
          diagramDiv.innerHTML = svg;
        } catch {
          diagramDiv.textContent = "図の描画に失敗しました";
        }

        const caption = document.createElement("figcaption");
        caption.className = "mt-2 text-center text-sm text-gray-500";
        caption.textContent = altText;

        wrapper.appendChild(diagramDiv);
        wrapper.appendChild(caption);
        pre.replaceWith(wrapper);
      }
    }

    renderMermaid();
  }, []);

  return null;
}
