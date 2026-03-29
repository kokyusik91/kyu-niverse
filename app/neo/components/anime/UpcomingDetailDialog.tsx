"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import type { AnimeItem } from "./types";

interface UpcomingDetailDialogProps {
  anime: AnimeItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function InfoBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-neo-border rounded-lg border-2 bg-[#FEF9C3] p-2.5 shadow-[3px_3px_0_#1a1a1a]">
      <p className="text-[9px] font-semibold text-gray-400">{label}</p>
      <p className="font-neo-heading text-sm font-bold">{value}</p>
    </div>
  );
}

export default function UpcomingDetailDialog({
  anime,
  open,
  onOpenChange,
}: UpcomingDetailDialogProps) {
  if (!anime) return null;

  const { items_base, anime: detail } = anime;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-neo-border shadow-neo-lg max-w-[520px] overflow-hidden rounded-2xl border-[5px] bg-white p-0 [&>button:last-child]:hidden">
        <VisuallyHidden>
          <DialogTitle>{items_base.name} 상세</DialogTitle>
        </VisuallyHidden>

        {/* Hero */}
        <div className="border-neo-border relative flex h-[160px] items-end border-b-3 bg-gradient-to-br from-[#FF6B6B] to-[#FF8E8E] p-5">
          {items_base.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={items_base.imageUrl}
              alt={items_base.name}
              className="absolute inset-0 h-full w-full object-cover opacity-30"
            />
          )}
          <div className="relative">
            <div className="border-neo-border mb-2 inline-block rounded-lg border-3 bg-white px-4 py-2 shadow-[4px_4px_0_#1a1a1a]">
              <h2 className="font-neo-heading text-xl font-black">
                {items_base.name}
              </h2>
            </div>
            <p className="text-sm font-medium text-white/80">
              {detail.titleEn}
              {detail.titleJa ? ` · ${detail.titleJa}` : ""}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="neo-scrollbar max-h-[400px] space-y-4 overflow-y-auto p-5">
          {/* Meta badges */}
          <div className="flex flex-wrap gap-2">
            {detail.type && <InfoBadge label="타입" value={detail.type} />}
            {detail.episodes && (
              <InfoBadge label="에피소드" value={`${detail.episodes}화`} />
            )}
            {detail.studio && (
              <InfoBadge label="스튜디오" value={detail.studio} />
            )}
            {detail.source && (
              <InfoBadge label="원작" value={detail.source} />
            )}
            {detail.airedFrom && (
              <InfoBadge
                label="방영 예정"
                value={detail.airedFrom}
              />
            )}
          </div>

          {/* Genre */}
          {detail.genre && (
            <div className="flex flex-wrap gap-1.5">
              {detail.genre.split(",").map((g) => (
                <span
                  key={g}
                  className="border-neo-border rounded-lg border-2 bg-gray-100 px-2.5 py-1 text-xs font-bold"
                >
                  {g.trim()}
                </span>
              ))}
            </div>
          )}

          {/* Synopsis */}
          {detail.synopsis && (
            <div className="border-neo-border rounded-xl border-3 bg-gray-50 p-4">
              <p className="font-neo-heading mb-2 text-[10px] font-black tracking-[2px] text-gray-400">
                SYNOPSIS
              </p>
              <p className="text-sm leading-relaxed text-gray-700">
                {detail.synopsis}
              </p>
            </div>
          )}

          {/* MAL link */}
          {detail.malUrl && (
            <a
              href={detail.malUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="neo-btn bg-neo-accent text-neo-text border-neo-border shadow-neo-md hover:shadow-neo-sm flex h-11 items-center justify-center gap-2 rounded-xl border-3 text-sm font-black no-underline transition-all hover:translate-y-[1px]"
            >
              <span>↗</span>
              MyAnimeList에서 보기
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
