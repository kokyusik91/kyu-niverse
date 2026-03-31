"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useQuery } from "@tanstack/react-query";
import { fetchAnimeDetail } from "./api";
import type { AnimeItem, CharacterSummary } from "./types";
import CharacterDetailDialog from "./CharacterDetailDialog";

const CHARACTER_COLORS = [
  "#FF6B6B",
  "#C4B5FD",
  "#93C5FD",
  "#4ADE80",
  "#FACC15",
  "#F472B6",
];

interface UpcomingDetailDialogProps {
  anime: AnimeItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UpcomingDetailDialog({
  anime,
  open,
  onOpenChange,
}: UpcomingDetailDialogProps) {
  const animeId = anime?.items_base.id ?? null;
  const [selectedChar, setSelectedChar] = useState<CharacterSummary | null>(null);
  const [charDialogOpen, setCharDialogOpen] = useState(false);
  const [showOriginalSynopsis, setShowOriginalSynopsis] = useState(false);

  const { data: detailData } = useQuery({
    queryKey: ["anime-detail", animeId],
    queryFn: () => fetchAnimeDetail(animeId!),
    enabled: open && animeId != null,
  });

  if (!anime) return null;

  const { items_base, anime: detail } = anime;
  const characters = detailData?.characters ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-[900px] overflow-hidden rounded-2xl border-[5px] border-[#1a1a1a] bg-white p-0 text-[#1a1a1a] shadow-[8px_8px_0_#1a1a1a] [&>button:last-child]:hidden">
        <VisuallyHidden>
          <DialogTitle>{items_base.name} 상세</DialogTitle>
        </VisuallyHidden>

        <div className="flex">
          {/* 좌측 — 포스터 이미지 */}
          <div className="hidden w-[40%] shrink-0 overflow-hidden border-r-3 border-[#1a1a1a] sm:block">
            {items_base.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={items_base.imageUrl}
                alt={items_base.name}
                className="h-full w-full object-cover"
              />
            )}
          </div>

          {/* 우측 — 콘텐츠 */}
          <div className="neo-scrollbar max-h-[500px] min-w-0 flex-1 space-y-4 overflow-y-auto px-8 py-5">
            {/* Title */}
            <div>
              <h2 className="font-neo-heading text-base font-black text-[#1a1a1a]">
                {items_base.name}
              </h2>
              {(detail.titleEn || detail.titleJa) && (
                <p className="mt-1 text-xs text-gray-500">
                  {[detail.titleEn, detail.titleJa].filter(Boolean).join(" · ")}
                </p>
              )}
            </div>
            {/* Meta info */}
            <div className="space-y-1.5 text-sm">
              {detail.type && (
                <div className="flex gap-2">
                  <span className="w-16 shrink-0 font-semibold text-gray-400">타입</span>
                  <span className="font-bold">{detail.type}</span>
                </div>
              )}
              {detail.episodes && (
                <div className="flex gap-2">
                  <span className="w-16 shrink-0 font-semibold text-gray-400">에피소드</span>
                  <span className="font-bold">{detail.episodes}화</span>
                </div>
              )}
              {detail.studio && (
                <div className="flex gap-2">
                  <span className="w-16 shrink-0 font-semibold text-gray-400">스튜디오</span>
                  <span className="font-bold">{detail.studio}</span>
                </div>
              )}
              {detail.source && (
                <div className="flex gap-2">
                  <span className="w-16 shrink-0 font-semibold text-gray-400">원작</span>
                  <span className="font-bold">{detail.source}</span>
                </div>
              )}
              {detail.airedFrom && (
                <div className="flex gap-2">
                  <span className="w-16 shrink-0 font-semibold text-gray-400">방영 예정</span>
                  <span className="font-bold">{detail.airedFrom}</span>
                </div>
              )}
            </div>

            {/* Genre */}
            {detail.genre && (
              <div className="flex flex-wrap gap-1.5">
                {detail.genre.split(",").map((g, i) => {
                  const colors = ["#FF6B6B", "#93C5FD", "#C4B5FD", "#4ADE80", "#FACC15", "#F472B6"];
                  return (
                    <span
                      key={g}
                      className="rounded-lg border-2 border-[#1a1a1a] px-2.5 py-1 text-xs font-bold text-[#1a1a1a]"
                      style={{ backgroundColor: colors[i % colors.length] }}
                    >
                      {g.trim()}
                    </span>
                  );
                })}
              </div>
            )}

            {/* Synopsis */}
            {(detail.synopsis || detail.synopsisKr) && (
              <div className="rounded-xl border-3 border-[#1a1a1a] bg-gray-50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-neo-heading text-[10px] font-black tracking-[2px] text-gray-400">
                    SYNOPSIS
                  </p>
                  {detail.synopsis && detail.synopsisKr && (
                    <button
                      type="button"
                      onClick={() => setShowOriginalSynopsis((prev) => !prev)}
                      className="rounded-md border-2 border-[#1a1a1a] bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-[#1a1a1a] transition-colors hover:bg-gray-200"
                    >
                      {showOriginalSynopsis ? "KR" : "EN"}
                    </button>
                  )}
                </div>
                <p className="text-sm leading-relaxed text-gray-700">
                  {showOriginalSynopsis
                    ? detail.synopsis
                    : (detail.synopsisKr ?? detail.synopsis)}
                </p>
              </div>
            )}

            {/* Characters */}
            {characters.length > 0 && (
              <div className="space-y-2">
                <p className="font-neo-heading text-[10px] font-black tracking-[2px] text-gray-400">
                  CHARACTERS
                </p>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {characters.slice(0, 6).map((char, i) => (
                    <button
                      key={char.id}
                      onClick={() => {
                        setSelectedChar(char);
                        setCharDialogOpen(true);
                      }}
                      className="w-[80px] shrink-0 cursor-pointer overflow-hidden rounded-xl border-2 border-[#1a1a1a] text-left shadow-[3px_3px_0_#1a1a1a]"
                    >
                      <div
                        className="flex h-[70px] items-center justify-center overflow-hidden"
                        style={{
                          backgroundColor:
                            CHARACTER_COLORS[i % CHARACTER_COLORS.length],
                        }}
                      >
                        {char.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={char.imageUrl}
                            alt={char.nameKr ?? char.nameEn ?? ""}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <span className="text-xl opacity-40">👤</span>
                        )}
                      </div>
                      <div className="bg-white p-1 text-center">
                        <p className="truncate text-[9px] font-bold text-[#1a1a1a]">
                          {char.nameKr ?? char.nameEn}
                        </p>
                        <p className="truncate text-[8px] text-gray-400">
                          {char.role}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        <CharacterDetailDialog
          character={selectedChar}
          animeId={animeId ?? undefined}
          open={charDialogOpen}
          onOpenChange={setCharDialogOpen}
        />
      </DialogContent>
    </Dialog>
  );
}
