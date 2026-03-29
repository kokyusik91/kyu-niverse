"use client";

import type { AnimeItem } from "./types";

const ACCENT_COLORS = [
  "#FF6B6B",
  "#A78BFA",
  "#4ADE80",
  "#38BDF8",
  "#FACC15",
  "#F472B6",
  "#FB923C",
  "#34D399",
];

interface AnimeCardProps {
  anime: AnimeItem;
  index: number;
  onClick: () => void;
}

export default function AnimeCard({ anime, index, onClick }: AnimeCardProps) {
  const { items_base, anime: detail } = anime;
  const accentColor = ACCENT_COLORS[index % ACCENT_COLORS.length];
  const statusLabel =
    detail.status === "Currently Airing" ? "방영중" : "방영완료";
  const ratingDisplay = items_base.rating
    ? (items_base.rating / 10).toFixed(1)
    : null;

  return (
    <button
      onClick={onClick}
      className="bg-neo-surface border-neo-border overflow-hidden rounded-xl border-3 text-left transition-transform hover:scale-[1.02]"
      style={{ boxShadow: "5px 5px 0 #1a1a1a" }}
    >
      <div
        className="relative h-[200px] overflow-hidden"
        style={{ backgroundColor: accentColor }}
      >
        {items_base.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={items_base.imageUrl}
            alt={items_base.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-6xl opacity-30">
            🎬
          </div>
        )}

        {ratingDisplay && (
          <div className="border-neo-border absolute top-2 left-2 flex items-center gap-1 rounded-lg border-2 bg-white px-2 py-0.5 shadow-[3px_3px_0_#1a1a1a]">
            <span className="text-xs">★</span>
            <span className="font-neo-heading text-sm font-bold">
              {ratingDisplay}
            </span>
          </div>
        )}

        <div
          className="border-neo-border absolute top-2 right-2 rounded-md border-2 px-2 py-0.5 text-[10px] font-bold"
          style={{ backgroundColor: accentColor }}
        >
          {statusLabel}
        </div>

        {detail.type && (
          <div className="border-neo-border absolute bottom-2 left-2 rounded-md border-2 bg-white px-2 py-0.5 text-[10px] font-bold">
            {detail.type}
            {detail.episodes ? ` · ${detail.episodes}화` : ""}
          </div>
        )}
      </div>

      <div className="space-y-1 p-3">
        <h3 className="font-neo-heading text-neo-text truncate text-sm font-bold">
          {items_base.name}
        </h3>
        <p className="truncate text-xs text-gray-400">
          {detail.titleEn ?? detail.titleJa}
        </p>
        {detail.genre && (
          <div className="flex flex-wrap gap-1">
            {detail.genre
              .split(",")
              .slice(0, 2)
              .map((g) => (
                <span
                  key={g}
                  className="border-neo-border rounded-md border bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold"
                >
                  {g.trim()}
                </span>
              ))}
          </div>
        )}
      </div>
    </button>
  );
}
