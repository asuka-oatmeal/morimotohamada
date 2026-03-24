const CATEGORY_IMAGES: Record<string, { src: string; position: string }> = {
  divorce: { src: "/images/articles/bg-divorce.jpg", position: "center 60%" },
  inheritance: { src: "/images/articles/bg-inheritance.jpg", position: "center 40%" },
  "traffic-accident": { src: "/images/articles/bg-traffic.jpg", position: "center 70%" },
  labor: { src: "/images/articles/bg-labor.jpg", position: "center center" },
  debt: { src: "/images/articles/bg-debt.jpg", position: "center center" },
  "real-estate": { src: "/images/articles/bg-realestate.jpg", position: "center 30%" },
  criminal: { src: "/images/articles/bg-criminal.jpg", position: "center center" },
};

export default function ArticleEyecatch({
  categorySlug,
  categoryLabel,
  title,
  size = "large",
}: {
  categorySlug: string;
  categoryLabel: string;
  title?: string;
  size?: "large" | "small";
}) {
  const cat = CATEGORY_IMAGES[categorySlug] || CATEGORY_IMAGES.divorce;

  if (size === "small") {
    return (
      <div
        className="relative w-32 shrink-0 self-stretch overflow-hidden rounded-l-lg sm:w-40"
        style={{
          backgroundImage: `url(${cat.src})`,
          backgroundSize: "cover",
          backgroundPosition: cat.position,
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative flex h-full items-center justify-center">
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm sm:text-xs">
            {categoryLabel}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative h-48 overflow-hidden rounded-t-lg sm:h-64"
      style={{
        backgroundImage: `url(${cat.src})`,
        backgroundSize: "cover",
        backgroundPosition: cat.position,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
      <div className="relative flex h-full flex-col justify-end p-5 sm:p-8">
        <span className="mb-2 w-fit rounded-full bg-[var(--color-accent)] px-3 py-0.5 text-[11px] font-bold text-white sm:text-xs">
          {categoryLabel}
        </span>
        {title && (
          <h2 className="text-lg font-bold leading-snug text-white drop-shadow-md sm:text-2xl lg:text-3xl">
            {title}
          </h2>
        )}
      </div>
    </div>
  );
}
