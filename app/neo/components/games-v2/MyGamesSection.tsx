"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Gamepad2, ArrowRight, Clock, Star, ArrowDownAZ, Calendar } from "lucide-react";
import { fetchGames } from "./api";
import type { GameItem } from "./types";

type SortKey = "playHours" | "metacritic" | "name" | "releasedAt";

const SORT_COMPARATORS: Record<SortKey, (a: GameItem, b: GameItem) => number> = {
  playHours: (a, b) => b.playHours - a.playHours,
  metacritic: (a, b) => (b.metacritic ?? -1) - (a.metacritic ?? -1),
  name: (a, b) => a.name.localeCompare(b.name),
  releasedAt: (a, b) => (b.releasedAt ?? "").localeCompare(a.releasedAt ?? ""),
};

const SORT_ICONS: Record<SortKey, React.ReactNode> = {
  playHours: <Clock className="size-3.5" />,
  metacritic: <Star className="size-3.5" />,
  name: <ArrowDownAZ className="size-3.5" />,
  releasedAt: <Calendar className="size-3.5" />,
};

const SORT_ORDER: SortKey[] = ["playHours", "metacritic", "name", "releasedAt"];

const PREVIEW_COUNT = 4;

function GameCard({ game }: { game: GameItem }) {
  return (
    <div className="w-[calc(25%-10.5px)] shrink-0 overflow-hidden rounded-lg border-2 border-[#1A1A2E] bg-white shadow-[3px_3px_0_#1A1A2E]">
      <div className="h-[90px] overflow-hidden bg-gray-100">
        {game.imageUrl ? (
          <img
            src={game.imageUrl}
            alt={game.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Gamepad2 className="size-8 text-gray-300" />
          </div>
        )}
      </div>
      <div className="space-y-1 p-2.5">
        <p className="truncate font-['Space_Grotesk'] text-xs font-bold text-[#1A1A2E]">
          {game.name}
        </p>
        <div className="flex items-center gap-1.5">
          <span className="flex items-center gap-0.5 font-mono text-[10px] text-gray-500">
            <Clock className="size-3" />
            {game.playHours}h
          </span>
          {game.metacritic != null && (
            <span className="rounded bg-[#51CF66] px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
              {game.metacritic}
            </span>
          )}
          <span className="ml-auto font-mono text-[10px] text-gray-400">
            {game.platform}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function MyGamesSection() {
  const { data: games = [], isLoading } = useQuery({
    queryKey: ["games"],
    queryFn: fetchGames,
  });

  const [showAll, setShowAll] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("playHours");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const allGenres = useMemo(() => {
    const genreSet = new Set<string>();
    for (const game of games) {
      for (const g of game.genre) genreSet.add(g);
    }
    return Array.from(genreSet).sort();
  }, [games]);

  const sortedGames = useMemo(() => {
    const filtered = selectedGenre
      ? games.filter((g) => g.genre.includes(selectedGenre))
      : games;
    return [...filtered].sort(SORT_COMPARATORS[sortKey]);
  }, [games, sortKey, selectedGenre]);

  const displayedGames = showAll ? sortedGames : sortedGames.slice(0, PREVIEW_COUNT);

  const handleSortCycle = () => {
    const nextIndex = (SORT_ORDER.indexOf(sortKey) + 1) % SORT_ORDER.length;
    setSortKey(SORT_ORDER[nextIndex]);
  };

  if (isLoading) {
    return (
      <div className="space-y-3 border-b-2 border-[#1A1A2E] p-5">
        <div className="h-5 w-32 animate-pulse rounded bg-gray-100" />
        <div className="flex gap-3.5">
          {Array.from({ length: PREVIEW_COUNT }).map((_, i) => (
            <div
              key={i}
              className="h-[160px] flex-1 animate-pulse rounded-lg border-2 border-gray-200 bg-gray-50"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="border-b-2 border-[#1A1A2E] p-5">
      {/* Header */}
      <div className="mb-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gamepad2 className="size-[18px] text-[#1A1A2E]" />
          <span className="font-['Space_Grotesk'] text-lg font-bold text-[#1A1A2E]">
            My Games
          </span>
          <span className="rounded-full bg-[#1A1A2E] px-2 py-0.5 font-mono text-[10px] font-bold text-white">
            {games.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSortCycle}
            className="flex size-7 items-center justify-center rounded-md border-2 border-[#1A1A2E] bg-[#FFE66D] text-[#1A1A2E] shadow-[2px_2px_0_#1A1A2E] transition-colors hover:bg-[#4ECDC4]"
            title={sortKey}
          >
            {SORT_ICONS[sortKey]}
          </button>
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-1 rounded-md border-2 border-[#1A1A2E] bg-white px-3 py-1.5 font-mono text-[11px] font-medium text-[#1A1A2E] shadow-[2px_2px_0_#1A1A2E] transition-colors hover:bg-gray-50"
          >
            {showAll ? "Collapse" : "See All"}
            <ArrowRight className="size-3" />
          </button>
        </div>
      </div>

      {/* Genre Filter (show when expanded) */}
      {showAll && (
        <div className="mb-3.5 flex flex-wrap gap-1.5">
          {["All", ...allGenres].map((genre) => {
            const isActive = genre === "All" ? selectedGenre === null : selectedGenre === genre;
            return (
              <button
                key={genre}
                type="button"
                onClick={() => setSelectedGenre(genre === "All" ? null : genre)}
                className={`rounded-md border-2 border-[#1A1A2E] px-2.5 py-1 font-mono text-[10px] font-medium transition-colors ${
                  isActive
                    ? "bg-[#1A1A2E] text-white"
                    : "bg-white text-[#1A1A2E] shadow-[2px_2px_0_#1A1A2E] hover:bg-gray-50"
                }`}
              >
                {genre}
              </button>
            );
          })}
        </div>
      )}

      {/* Cards */}
      <div className={showAll ? "flex flex-wrap gap-3.5" : "flex gap-3.5"}>
        {displayedGames.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}
