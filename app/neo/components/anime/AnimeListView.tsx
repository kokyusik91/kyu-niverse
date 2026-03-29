"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAnimeList, fetchUpcomingAnime } from "./api";
import type { AnimeItem } from "./types";
import UpcomingCard from "./UpcomingCard";
import AnimeCard from "./AnimeCard";
import UpcomingDetailDialog from "./UpcomingDetailDialog";

interface AnimeListViewProps {
  onSelectAnime: (id: number) => void;
}

export default function AnimeListView({ onSelectAnime }: AnimeListViewProps) {
  const { data: upcomingData, isLoading: upcomingLoading } = useQuery({
    queryKey: ["anime-upcoming"],
    queryFn: fetchUpcomingAnime,
  });

  const { data: animeData, isLoading: animeLoading } = useQuery({
    queryKey: ["anime-list"],
    queryFn: fetchAnimeList,
  });

  const [selectedUpcoming, setSelectedUpcoming] = useState<AnimeItem | null>(
    null,
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  const upcoming = upcomingData?.data ?? [];
  const myAnime = animeData?.data ?? [];
  const isLoading = upcomingLoading || animeLoading;

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
    <div className="neo-scrollbar h-full overflow-y-auto">
      {/* Coming Soon Section */}
      {upcoming.length > 0 && (
        <section className="space-y-3 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="border-neo-border flex h-8 w-8 items-center justify-center rounded-md border-3 bg-[#FACC15] shadow-[3px_3px_0_#1a1a1a]">
              <span className="text-sm">📺</span>
            </div>
            <h2 className="font-neo-heading text-neo-text text-lg font-black tracking-wide">
              COMING SOON
            </h2>
            <span className="text-sm text-gray-400">방영예정</span>
          </div>

          <div className="flex gap-3.5 overflow-x-auto pb-1">
            {upcoming.map((anime, i) => (
              <div key={anime.items_base.id} className="w-[140px] shrink-0">
                <UpcomingCard
                  anime={anime}
                  index={i}
                  onClick={() => {
                    setSelectedUpcoming(anime);
                    setDialogOpen(true);
                  }}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* My Collection Section */}
      <section className="px-5 pb-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm">📺</span>
            <h2 className="font-neo-heading text-neo-text text-base font-black">
              MY COLLECTION
            </h2>
            <span className="border-neo-border rounded-full bg-[#1a1a1a] px-2 py-0.5 text-[10px] font-bold text-white">
              {myAnime.length}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {myAnime.map((anime, i) => (
            <AnimeCard
              key={anime.items_base.id}
              anime={anime}
              index={i}
              onClick={() => onSelectAnime(anime.items_base.id)}
            />
          ))}
        </div>
      </section>

      <UpcomingDetailDialog
        anime={selectedUpcoming}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
