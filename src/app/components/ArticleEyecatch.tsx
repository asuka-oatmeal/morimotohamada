const CATEGORY_COLORS: Record<string, { bg: string; accent: string }> = {
  divorce: { bg: "#2c4f7c", accent: "#c5983a" },
  inheritance: { bg: "#3a6b4a", accent: "#c5983a" },
  "traffic-accident": { bg: "#7c3a2c", accent: "#d4a84a" },
  labor: { bg: "#4a3a6b", accent: "#c5983a" },
  debt: { bg: "#2c6b7c", accent: "#c5983a" },
  "real-estate": { bg: "#5a6b3a", accent: "#c5983a" },
  criminal: { bg: "#5a3a3a", accent: "#c5983a" },
};

const CATEGORY_ICONS: Record<string, string> = {
  divorce: "👨‍👩‍👧",
  inheritance: "📜",
  "traffic-accident": "🚗",
  labor: "💼",
  debt: "💳",
  "real-estate": "🏠",
  criminal: "⚖️",
};

export default function ArticleEyecatch({
  categorySlug,
  categoryLabel,
  size = "large",
}: {
  categorySlug: string;
  categoryLabel: string;
  size?: "large" | "small";
}) {
  const colors = CATEGORY_COLORS[categorySlug] || CATEGORY_COLORS.divorce;
  const icon = CATEGORY_ICONS[categorySlug] || "⚖️";

  if (size === "small") {
    return (
      <div
        className="flex h-20 w-28 shrink-0 items-center justify-center rounded-lg sm:h-24 sm:w-32"
        style={{
          background: `linear-gradient(135deg, ${colors.bg}, ${colors.bg}cc)`,
        }}
      >
        <span className="text-2xl sm:text-3xl">{icon}</span>
      </div>
    );
  }

  return (
    <div
      className="flex h-40 items-center justify-center rounded-t-lg sm:h-52"
      style={{
        background: `linear-gradient(135deg, ${colors.bg}, ${colors.bg}cc)`,
      }}
    >
      <div className="flex flex-col items-center gap-2">
        <span className="text-4xl sm:text-5xl">{icon}</span>
        <span
          className="rounded-full px-3 py-0.5 text-xs font-bold text-white sm:text-sm"
          style={{ background: colors.accent }}
        >
          {categoryLabel}
        </span>
      </div>
    </div>
  );
}
