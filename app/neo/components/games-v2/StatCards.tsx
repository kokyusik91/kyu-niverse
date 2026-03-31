"use client";

import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { fetchStats } from "./api";

export default function StatCards() {
  const { data: stats } = useQuery({
    queryKey: ["game-stats"],
    queryFn: fetchStats,
  });

  if (!stats) {
    return (
      <div className="flex gap-4 p-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-[90px] flex-1 animate-pulse rounded-lg border-3 border-neo-border bg-gray-100"
          />
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: "TOTAL GAMES",
      value: String(stats.totalGames),
      bg: "bg-[#FF6B6B]",
      text: "text-white",
    },
    {
      label: "PLAY TIME",
      value: `${stats.totalPlayHours}h`,
      bg: "bg-[#4ECDC4]",
      text: "text-white",
    },
    {
      label: "MOST PLAYED",
      value: stats.mostPlayed.name.length > 12
        ? `${stats.mostPlayed.name.slice(0, 12)}…`
        : stats.mostPlayed.name,
      sub: `${stats.mostPlayed.playHours} hours`,
      bg: "bg-[#FFE66D]",
      text: "text-[#1A1A2E]",
      smallValue: true,
    },
    {
      label: "AVG SCORE",
      value: String(stats.avgMetacritic),
      icon: <Star className="size-4 fill-[#FF922B] text-[#FF922B]" />,
      bg: "bg-white",
      text: "text-[#1A1A2E]",
    },
  ];

  return (
    <div className="flex gap-4 border-b-2 border-[#1A1A2E] p-5">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`flex-1 rounded-lg border-3 border-[#1A1A2E] ${card.bg} p-3.5 shadow-[3px_3px_0_#1A1A2E]`}
        >
          <p className={`font-mono text-[10px] font-medium uppercase tracking-wider ${card.text} opacity-70`}>
            {card.label}
          </p>
          <p
            className={`font-['Space_Grotesk'] ${card.smallValue ? "text-[22px]" : "text-[32px]"} font-bold leading-tight ${card.text}`}
            style={{ letterSpacing: card.smallValue ? "-1px" : "-2px" }}
          >
            {card.value}
          </p>
          {card.sub && (
            <p className={`font-mono text-[11px] font-medium ${card.text} opacity-70`}>
              {card.sub}
            </p>
          )}
          {card.icon}
        </div>
      ))}
    </div>
  );
}
