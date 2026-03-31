"use client";

import { useQuery } from "@tanstack/react-query";
import { Flame, Star } from "lucide-react";
import { fetchRankings } from "./api";
import type { RankingItem } from "./types";

function RankBadge({ item }: { item: RankingItem }) {
  if (item.added != null) {
    return (
      <div className="flex shrink-0 items-center gap-1 rounded-md border-2 border-[#1A1A2E] bg-[#FF6B6B] px-2 py-1.5 font-mono text-xs font-bold text-white">
        <Flame className="size-3" />
        {item.added.toLocaleString()}
      </div>
    );
  }
  if (item.rating != null) {
    return (
      <div className="flex shrink-0 items-center gap-1 rounded-md border-2 border-[#1A1A2E] bg-[#FFE66D] px-2 py-1.5 font-mono text-xs font-bold text-[#1A1A2E]">
        <Star className="size-3" />
        {item.rating}
      </div>
    );
  }
  return null;
}

function RankRow({ item }: { item: RankingItem }) {
  const isTopThree = item.rank <= 3;
  const rankColor = isTopThree ? "text-[#FFE66D]" : "text-[#C0C0C0]";

  return (
    <div className="flex items-center gap-2.5 rounded-lg border-2 border-[#1A1A2E] bg-white px-3 py-2 shadow-[3px_3px_0_#1A1A2E]">
      <span
        className={`w-7 text-center font-['Space_Grotesk'] text-2xl font-extrabold ${rankColor}`}
        style={{ WebkitTextStroke: isTopThree ? "1px #1A1A2E" : "none" }}
      >
        {item.rank}
      </span>
      <div className="size-10 shrink-0 overflow-hidden rounded-md border-2 border-[#1A1A2E] bg-gray-100">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-gray-300">
            ?
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="truncate font-['Space_Grotesk'] text-xs font-bold text-[#1A1A2E]">
          {item.name}
        </p>
        <p className="truncate font-mono text-[10px] text-gray-400">
          {item.genre.slice(0, 2).join(", ")}
        </p>
      </div>
      <RankBadge item={item} />
    </div>
  );
}

export default function RankingsSection() {
  const { data: rankings = [], isLoading } = useQuery({
    queryKey: ["game-rankings"],
    queryFn: fetchRankings,
  });

  if (isLoading) {
    return (
      <div className="space-y-3 border-b-2 border-[#1A1A2E] p-5">
        <div className="h-7 w-48 animate-pulse rounded bg-gray-100" />
        <div className="flex gap-4">
          {[0, 1].map((col) => (
            <div key={col} className="flex flex-1 flex-col gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-14 animate-pulse rounded-lg border-2 border-gray-200 bg-gray-50"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const midpoint = Math.ceil(rankings.length / 2);
  const leftColumn = rankings.slice(0, midpoint);
  const rightColumn = rankings.slice(midpoint);

  return (
    <div className="border-b-2 border-[#1A1A2E] p-5">
      <div className="mb-3.5 flex items-center gap-2.5">
        <Flame className="size-7 text-[#FF6B6B]" strokeWidth={2.5} />
        <span className="font-['Space_Grotesk'] text-[22px] font-bold text-[#1A1A2E]">
          Hot Games
        </span>
      </div>

      <div className="flex gap-4">
        <div className="flex flex-1 flex-col gap-2">
          {leftColumn.map((item) => (
            <RankRow key={item.id} item={item} />
          ))}
        </div>
        <div className="flex flex-1 flex-col gap-2">
          {rightColumn.map((item) => (
            <RankRow key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
