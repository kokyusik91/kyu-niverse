"use client";

import type { AnimeItem } from "./types";

const CARD_COLORS = ["#FF6B6B", "#38BDF8", "#C4B5FD", "#4ADE80", "#FACC15"];

function getDaysUntil(dateStr: string | null): string | null {
  if (!dateStr) return null;
  const diff = Math.ceil(
    (new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
  if (diff < 0) return null;
  return `D-${diff}`;
}

interface UpcomingCardProps {
  anime: AnimeItem;
  index: number;
  onClick: () => void;
}

export default function UpcomingCard({
  anime,
  index,
  onClick,
}: UpcomingCardProps) {
  const color = CARD_COLORS[index % CARD_COLORS.length];
  const dday = getDaysUntil(anime.anime.airedFrom);

  return (
    <button
      onClick={onClick}
      className="border-neo-border flex h-[140px] cursor-pointer flex-col rounded-[10px] border-3 p-3 text-left"
      style={{
        backgroundColor: color,
        boxShadow: "4px 4px 0 #1a1a1a",
      }}
    >
      <div className="mb-2 text-3xl">
        {anime.items_base.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={anime.items_base.imageUrl}
            alt={anime.items_base.name}
            className="border-neo-border h-14 w-14 rounded-lg border-2 object-cover"
            loading="lazy"
          />
        ) : (
          <span>🎬</span>
        )}
      </div>
      <p className="font-neo-heading text-neo-text line-clamp-2 text-xs font-bold">
        {anime.items_base.name}
      </p>
      <div className="mt-auto">
        {dday && (
          <span className="bg-neo-bg border-neo-border mt-1.5 inline-block rounded-md border-2 px-2 py-0.5 text-[10px] font-bold">
            {dday}
          </span>
        )}
      </div>
    </button>
  );
}
