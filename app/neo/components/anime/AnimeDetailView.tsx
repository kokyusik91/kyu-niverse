"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAnimeDetail, fetchRelationshipGraph } from "./api";
import type { AnimeDetailResponse, RelationshipGraphData } from "./types";
import type { AnimeItem, CharacterSummary } from "./types";
import { ArrowLeft } from "lucide-react";
import RelationshipGraph from "./RelationshipGraph";
import UpcomingDetailDialog from "./UpcomingDetailDialog";
import CharacterDetailDialog from "./CharacterDetailDialog";

const ACCENT_COLORS = ["#FF6B6B", "#FACC15", "#38BDF8", "#A78BFA", "#4ADE80"];

const CHARACTER_COLORS = [
  "#FF6B6B",
  "#C4B5FD",
  "#93C5FD",
  "#4ADE80",
  "#FACC15",
  "#F472B6",
  "#FB923C",
];

interface AnimeDetailViewProps {
  animeId: number;
  onBack: () => void;
  onViewAllCharacters: (animeId: number) => void;
}

export default function AnimeDetailView({
  animeId,
  onBack,
  onViewAllCharacters,
}: AnimeDetailViewProps) {
  const { data: detail, isLoading } = useQuery({
    queryKey: ["anime-detail", animeId],
    queryFn: () => fetchAnimeDetail(animeId),
  });

  // 후속작이면 본편(parentId) 데이터도 가져옴 (시리즈 + 관계도)
  const parentId = detail?.anime.parentId ?? null;
  const graphAnimeId = parentId ?? animeId;

  const { data: parentDetail } = useQuery({
    queryKey: ["anime-detail", parentId],
    queryFn: () => fetchAnimeDetail(parentId!),
    enabled: !!detail && parentId != null,
  });

  const { data: graphData } = useQuery({
    queryKey: ["anime-graph", graphAnimeId],
    queryFn: () => fetchRelationshipGraph(graphAnimeId),
    enabled: !!detail,
  });

  // 시리즈 클릭 → Dialog
  const [seriesDialogAnime, setSeriesDialogAnime] = useState<AnimeItem | null>(
    null,
  );
  const [seriesDialogOpen, setSeriesDialogOpen] = useState(false);

  // 캐릭터 클릭 → Dialog
  const [selectedChar, setSelectedChar] = useState<CharacterSummary | null>(
    null,
  );
  const [charDialogOpen, setCharDialogOpen] = useState(false);
  const [showAllCharacters, setShowAllCharacters] = useState(false);
  const [showOriginalSynopsis, setShowOriginalSynopsis] = useState(false);

  if (isLoading || !detail) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="text-sm font-semibold text-gray-400">
          불러오는 중...
        </span>
      </div>
    );
  }

  const { items_base, anime, sequels, characters } = detail;
  const ratingDisplay = items_base.rating
    ? (items_base.rating / 10).toFixed(1)
    : null;

  // 시리즈 라인업: 후속작이면 본편 기준으로 전체 시리즈 구성
  const isSequel = parentId != null;
  const seriesParent =
    isSequel && parentDetail
      ? { items_base: parentDetail.items_base, anime: parentDetail.anime }
      : null;
  const seriesSequels =
    isSequel && parentDetail ? parentDetail.sequels : sequels;
  const hasSeriesData = isSequel ? !!parentDetail : sequels.length > 0;

  return (
    <div className="neo-scrollbar h-full overflow-y-auto">
      {/* Hero Section */}
      <div className="border-neo-border relative h-[500px] overflow-hidden border-b-3">
        {items_base.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={items_base.imageUrl}
            alt={items_base.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* Back button */}
        <button
          onClick={onBack}
          className="border-neo-border absolute top-4 left-4 flex items-center gap-1.5 rounded-lg border-2 bg-white px-3.5 py-1.5 text-xs font-bold shadow-[3px_3px_0_#1a1a1a] transition-all hover:translate-y-[1px] hover:shadow-[2px_2px_0_#1a1a1a]"
        >
          <ArrowLeft size={14} />
          목록
        </button>

        {/* Rating badge */}
        {ratingDisplay && (
          <div
            className="border-neo-border absolute top-4 right-4 rounded-lg border-2 bg-[#FACC15] px-4 py-1.5 shadow-[3px_3px_0_#1a1a1a]"
            style={{ transform: "rotate(3deg)" }}
          >
            <span className="font-neo-heading text-base font-black">
              ★ {ratingDisplay}
            </span>
          </div>
        )}

        {/* Title */}
        <div
          className="border-neo-border absolute bottom-5 left-5 rounded-[10px] border-3 bg-white px-5 py-2 shadow-[4px_4px_0_#1a1a1a]"
          style={{ transform: "rotate(-1deg)" }}
        >
          <h1 className="font-neo-heading text-2xl font-black">
            {items_base.name}
          </h1>
        </div>
      </div>

      {/* Subtitle */}
      <div className="px-5 py-3">
        <p className="text-xs text-gray-400">
          {[anime.titleEn, anime.titleJa].filter(Boolean).join(" · ")}
        </p>
      </div>

      {/* Meta Badges */}
      <div className="flex flex-wrap gap-2.5 px-5">
        {anime.type && <MetaBadge label="타입" value={anime.type} />}
        {anime.episodes && (
          <MetaBadge label="에피소드" value={`${anime.episodes}화`} />
        )}
        {anime.airedFrom && (
          <MetaBadge
            label="방영"
            value={anime.airedFrom.slice(0, 7).replace("-", ".")}
          />
        )}
        {anime.studio && <MetaBadge label="스튜디오" value={anime.studio} />}
      </div>

      {/* Synopsis */}
      {(anime.synopsis || anime.synopsisKr) && (
        <div className="px-5 pt-4">
          <div className="border-neo-border rounded-xl border-3 bg-gray-50 p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-neo-heading text-[10px] font-black tracking-[2px] text-gray-400">
                SYNOPSIS
              </p>
              {anime.synopsis && anime.synopsisKr && (
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
                ? anime.synopsis
                : (anime.synopsisKr ?? anime.synopsis)}
            </p>
          </div>
        </div>
      )}

      {/* Series */}
      {hasSeriesData && (
        <div className="space-y-2.5 px-5 pt-4">
          <div
            className="inline-block rounded-md bg-[#1a1a1a] px-3"
            style={{ transform: "rotate(1deg)" }}
          >
            <span className="font-neo-heading text-[10px] font-black tracking-[2px] text-[#FACC15]">
              SERIES
            </span>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-1">
            {/* 본편 */}
            <SeriesCard
              label={seriesParent ? seriesParent.items_base.name : items_base.name}
              imageUrl={seriesParent ? seriesParent.items_base.imageUrl : items_base.imageUrl}
              type={seriesParent ? seriesParent.anime.type : anime.type}
              sub={
                seriesParent
                  ? `${seriesParent.anime.episodes ?? "?"}화 · ${seriesParent.anime.year ?? "?"}`
                  : `${anime.episodes ?? "?"}화 · ${anime.year ?? "?"}`
              }
              isCurrent={!seriesParent}
            />
            {/* 후속작들 */}
            {seriesSequels.map((seq) => (
              <SeriesCard
                key={seq.items_base.id}
                label={seq.items_base.name}
                imageUrl={seq.items_base.imageUrl}
                type={seq.anime.type}
                sub={
                  seq.anime.status === "Not yet aired"
                    ? "예정"
                    : `${seq.anime.episodes ?? "?"}화 · ${seq.anime.year ?? "?"}`
                }
                isCurrent={seq.items_base.id === animeId}
                onClick={() => {
                  setSeriesDialogAnime(seq);
                  setSeriesDialogOpen(true);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Characters Preview */}
      {characters.length > 0 && (
        <div className="space-y-2.5 px-5 pt-8">
          <div className="flex items-center justify-between">
            <div
              className="inline-block rounded-md bg-[#1a1a1a] px-3 py-1"
              style={{ transform: "rotate(-1deg)" }}
            >
              <span className="font-neo-heading text-[10px] font-black tracking-[2px] text-[#4ADE80]">
                CHARACTERS
              </span>
            </div>
          </div>

          {(() => {
            const COLLAPSED_COUNT = 9;
            const visibleChars = showAllCharacters ? characters : characters.slice(0, COLLAPSED_COUNT);
            const hasMore = characters.length > COLLAPSED_COUNT;

            return (
              <>
                <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                  {visibleChars.map((char, i) => (
                    <button
                      key={char.id}
                      onClick={() => {
                        setSelectedChar(char);
                        setCharDialogOpen(true);
                      }}
                      className="border-neo-border overflow-hidden rounded-xl border-2 text-left shadow-[4px_4px_0_#1a1a1a]"
                    >
                      <div
                        className="flex aspect-square items-center justify-center overflow-hidden"
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
                          <span className="text-2xl opacity-40">👤</span>
                        )}
                      </div>
                      <div className="bg-white p-1.5 text-center">
                        <p className="font-neo-heading truncate text-[10px] font-bold">
                          {char.nameKr ?? char.nameEn}
                        </p>
                        <p className="truncate text-[8px] text-gray-400">
                          {char.role}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
                {hasMore && (
                  <button
                    onClick={() => setShowAllCharacters(!showAllCharacters)}
                    className="border-neo-border w-full rounded-lg border-2 bg-white py-2 text-xs font-bold text-gray-500 transition-colors hover:bg-gray-50"
                  >
                    {showAllCharacters
                      ? "접기"
                      : `더보기 (+${characters.length - COLLAPSED_COUNT}명)`}
                  </button>
                )}
              </>
            );
          })()}
        </div>
      )}

      {/* Relationship Graph */}
      {graphData && graphData.nodes.length > 0 && (
        <div className="px-5 pt-4 pb-5">
          <RelationshipGraph data={graphData} />
        </div>
      )}



      <UpcomingDetailDialog
        anime={seriesDialogAnime}
        open={seriesDialogOpen}
        onOpenChange={setSeriesDialogOpen}
      />

      <CharacterDetailDialog
        character={selectedChar}
        animeId={animeId}
        open={charDialogOpen}
        onOpenChange={setCharDialogOpen}
      />
    </div>
  );
}

function MetaBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-neo-border rounded-[10px] border-2 bg-white px-4 py-2.5 shadow-[3px_3px_0_#1a1a1a]">
      <p className="text-[9px] font-semibold text-gray-400">{label}</p>
      <p className="font-neo-heading text-sm font-bold">{value}</p>
    </div>
  );
}

function SeriesCard({
  label,
  imageUrl,
  type,
  sub,
  isCurrent,
  onClick,
}: {
  label: string;
  imageUrl: string | null;
  type: string;
  sub: string;
  isCurrent?: boolean;
  onClick?: () => void;
}) {
  const isClickable = !isCurrent && !!onClick;

  return (
    <div
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={isClickable ? onClick : undefined}
      className={`border-neo-border w-[160px] shrink-0 overflow-hidden rounded-xl border-2 bg-white ${
        isCurrent ? "ring-2 ring-[#FACC15] ring-offset-1" : ""
      } ${isClickable ? "cursor-pointer" : ""}`}
      style={{ boxShadow: "4px 4px 0 #1a1a1a" }}
    >
      <div className="relative overflow-hidden bg-gray-200" style={{ aspectRatio: "225 / 315" }}>
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={label}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[#FF6B6B]">
            <span className="text-2xl">🎬</span>
          </div>
        )}
        <span className="absolute top-1.5 left-1.5 rounded border border-[#1a1a1a] bg-white px-1.5 py-0.5 text-[8px] font-bold">
          {type}
        </span>
      </div>
      <div className="bg-white p-2">
        <p className="font-neo-heading line-clamp-2 text-[10px] font-bold leading-tight">
          {label}
        </p>
        <p className="mt-0.5 text-[9px] text-gray-400">{sub}</p>
      </div>
    </div>
  );
}
