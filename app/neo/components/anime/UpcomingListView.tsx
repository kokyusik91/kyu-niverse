"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUpcomingAnime } from "./api";
import type { AnimeItem } from "./types";
import UpcomingDetailDialog from "./UpcomingDetailDialog";
import { ArrowLeft, Search } from "lucide-react";

const CARD_COLORS = ["#FF6B6B", "#38BDF8", "#C4B5FD", "#4ADE80", "#FACC15", "#F472B6", "#FB923C", "#34D399"];

interface UpcomingListViewProps {
  onBack: () => void;
}

export default function UpcomingListView({ onBack }: UpcomingListViewProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["anime-upcoming-all"],
    queryFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_KYUNO_API_URL}/api/anime/upcoming?limit=500`,
      ).then((r) => r.json()),
  });

  const [search, setSearch] = useState("");
  const [selectedAnime, setSelectedAnime] = useState<AnimeItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const allUpcoming: AnimeItem[] = data?.data ?? [];

  const filtered = useMemo(() => {
    if (!search) return allUpcoming;
    const q = search.toLowerCase();
    return allUpcoming.filter(
      (a) =>
        a.items_base.name.toLowerCase().includes(q) ||
        a.anime.titleEn?.toLowerCase().includes(q) ||
        a.anime.titleJa?.includes(search),
    );
  }, [allUpcoming, search]);

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
      {/* Sub header */}
      <div className="border-neo-border flex items-center justify-between border-b-3 bg-white/60 px-5 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="border-neo-border flex items-center gap-1.5 rounded-lg border-2 bg-white px-3 py-1.5 text-xs font-bold shadow-[3px_3px_0_#1a1a1a] transition-all hover:translate-y-[1px] hover:shadow-[2px_2px_0_#1a1a1a]"
          >
            <ArrowLeft size={14} />
            목록
          </button>
          <div className="flex items-center gap-2">
            <span className="text-base">📺</span>
            <h2 className="font-neo-heading text-base font-black">
              COMING SOON
            </h2>
            <span className="border-neo-border rounded-full bg-[#1a1a1a] px-2 py-0.5 text-[10px] font-bold text-white">
              {allUpcoming.length}
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="border-neo-border flex w-[200px] items-center gap-2 rounded-lg border-2 bg-white px-3 py-1.5">
          <Search size={14} className="text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="작품 검색..."
            className="flex-1 bg-transparent text-xs outline-none placeholder:text-gray-300"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="neo-scrollbar flex-1 overflow-y-auto p-5">
        {filtered.length === 0 ? (
          <div className="flex h-40 items-center justify-center">
            <span className="text-sm text-gray-400">
              검색 결과가 없습니다.
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filtered.map((anime, i) => {
              const color = CARD_COLORS[i % CARD_COLORS.length];
              const daysUntil = getDaysUntil(anime.anime.airedFrom);

              return (
                <button
                  key={anime.items_base.id}
                  onClick={() => {
                    setSelectedAnime(anime);
                    setDialogOpen(true);
                  }}
                  className="border-neo-border overflow-hidden rounded-xl border-3 text-left transition-transform hover:scale-[1.02]"
                  style={{ boxShadow: "4px 4px 0 #1a1a1a" }}
                >
                  <div
                    className="flex h-[120px] items-center justify-center overflow-hidden"
                    style={{ backgroundColor: color }}
                  >
                    {anime.items_base.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={anime.items_base.imageUrl}
                        alt={anime.items_base.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-4xl opacity-30">🎬</span>
                    )}
                  </div>
                  <div className="space-y-1 bg-white p-2.5">
                    <p className="font-neo-heading line-clamp-2 text-xs font-bold">
                      {anime.items_base.name}
                    </p>
                    <div className="flex items-center gap-1.5">
                      {anime.anime.type && (
                        <span className="border-neo-border rounded border bg-gray-100 px-1.5 py-0.5 text-[9px] font-semibold">
                          {anime.anime.type}
                        </span>
                      )}
                      {daysUntil && (
                        <span className="rounded bg-[#FACC15] px-1.5 py-0.5 text-[9px] font-bold">
                          {daysUntil}
                        </span>
                      )}
                    </div>
                    {anime.anime.studio && (
                      <p className="truncate text-[10px] text-gray-400">
                        {anime.anime.studio}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <UpcomingDetailDialog
        anime={selectedAnime}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}

function getDaysUntil(dateStr: string | null): string | null {
  if (!dateStr) return null;
  const diff = Math.ceil(
    (new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
  if (diff < 0) return null;
  return `D-${diff}`;
}
