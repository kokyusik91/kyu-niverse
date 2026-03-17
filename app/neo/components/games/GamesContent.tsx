"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { GameItem, GamesApiResponse, SortKey } from "./types";
import QueryProvider from "../instagram/QueryProvider";
import GameDashboard from "./GameDashboard";
import GameFilterBar from "./GameFilterBar";
import GameCard from "./GameCard";

const API_BASE = process.env.NEXT_PUBLIC_GAMES_API_URL;

function toGameItem(raw: GamesApiResponse["data"][0]): GameItem {
  return {
    id: raw.items_base.id,
    name: raw.items_base.name,
    imageUrl: raw.items_base.imageUrl,
    rating: raw.items_base.rating,
    memo: raw.items_base.memo,
    genre: raw.games.genre ?? [],
    playHours: raw.games.playHours,
    platform: raw.games.platform,
    metacritic: raw.games.metacritic,
    releasedAt: raw.games.releasedAt,
  };
}

async function fetchGames(): Promise<GameItem[]> {
  const res = await fetch(`${API_BASE}/api/games?limit=100`);
  const json: GamesApiResponse = await res.json();
  return json.data.map(toGameItem);
}

const SORT_COMPARATORS: Record<SortKey, (a: GameItem, b: GameItem) => number> =
  {
    playHours: (a, b) => b.playHours - a.playHours,
    metacritic: (a, b) => (b.metacritic ?? -1) - (a.metacritic ?? -1),
    name: (a, b) => a.name.localeCompare(b.name),
    releasedAt: (a, b) =>
      (b.releasedAt ?? "").localeCompare(a.releasedAt ?? ""),
  };

function useGames() {
  const { data: games = [], isLoading } = useQuery({
    queryKey: ["games"],
    queryFn: fetchGames,
  });

  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("playHours");

  const allGenres = useMemo(() => {
    const genreSet = new Set<string>();
    for (const game of games) {
      for (const g of game.genre) genreSet.add(g);
    }
    return Array.from(genreSet).sort();
  }, [games]);

  const filteredGames = useMemo(() => {
    const filtered = selectedGenre
      ? games.filter((g) => g.genre.includes(selectedGenre))
      : games;
    return [...filtered].sort(SORT_COMPARATORS[sortKey]);
  }, [games, selectedGenre, sortKey]);

  const stats = useMemo(() => {
    const totalPlayHours = games.reduce((sum, g) => sum + g.playHours, 0);
    const mostPlayed = games.reduce(
      (max, g) => (g.playHours > max.playHours ? g : max),
      games[0] ?? { name: "-", playHours: 0 },
    );
    const withMeta = games.filter((g) => g.metacritic != null);
    const avgMetacritic = withMeta.length
      ? Math.round(
          withMeta.reduce((sum, g) => sum + g.metacritic!, 0) / withMeta.length,
        )
      : 0;

    return {
      totalGames: games.length,
      totalPlayHours,
      mostPlayedName: mostPlayed.name,
      mostPlayedHours: mostPlayed.playHours,
      avgMetacritic,
    };
  }, [games]);

  return {
    isLoading,
    allGenres,
    filteredGames,
    stats,
    selectedGenre,
    setSelectedGenre,
    sortKey,
    setSortKey,
  };
}

function GamesExplorer() {
  const {
    isLoading,
    allGenres,
    filteredGames,
    stats,
    selectedGenre,
    setSelectedGenre,
    sortKey,
    setSortKey,
  } = useGames();

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="text-sm font-semibold text-gray-400">
          불러오는 중...
        </span>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <GameDashboard stats={stats} />
      <GameFilterBar
        genres={allGenres}
        selectedGenre={selectedGenre}
        onSelectGenre={setSelectedGenre}
        sortKey={sortKey}
        onSortChange={setSortKey}
      />
      <div className="neo-scrollbar flex-1 overflow-y-auto p-3 md:p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-4">
          {filteredGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function GamesContent() {
  return (
    <QueryProvider>
      <GamesExplorer />
    </QueryProvider>
  );
}
