"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAnimeDetail, fetchRelationshipGraph } from "./api";
import type { AnimeDetailResponse, RelationshipGraphData } from "./types";
import { ArrowLeft } from "lucide-react";
import RelationshipGraph from "./RelationshipGraph";

const ACCENT_COLORS = [
  "#FF6B6B",
  "#FACC15",
  "#38BDF8",
  "#A78BFA",
  "#4ADE80",
];

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

  // 후속작이면 본편(parentId)의 관계도를 가져옴
  const graphAnimeId = detail?.anime.parentId ?? animeId;

  const { data: graphData } = useQuery({
    queryKey: ["anime-graph", graphAnimeId],
    queryFn: () => fetchRelationshipGraph(graphAnimeId),
    enabled: !!detail,
  });

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

  return (
    <div className="neo-scrollbar h-full overflow-y-auto">
      {/* Hero Section */}
      <div
        className="border-neo-border relative h-[200px] overflow-hidden border-b-3"
        style={{ backgroundColor: "#FF6B6B" }}
      >
        {items_base.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={items_base.imageUrl}
            alt={items_base.name}
            className="absolute inset-0 h-full w-full object-cover opacity-30"
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
      {anime.synopsis && (
        <div className="px-5 pt-4">
          <div className="border-neo-border rounded-xl border-3 bg-gray-50 p-4">
            <p className="font-neo-heading mb-2 text-[10px] font-black tracking-[2px] text-gray-400">
              SYNOPSIS
            </p>
            <p className="text-sm leading-relaxed text-gray-700">
              {anime.synopsis}
            </p>
          </div>
        </div>
      )}

      {/* Series / Sequels */}
      {sequels.length > 0 && (
        <div className="space-y-2.5 px-5 pt-4">
          <div
            className="inline-block rounded-md bg-[#1a1a1a] px-3 py-1"
            style={{ transform: "rotate(1deg)" }}
          >
            <span className="font-neo-heading text-[10px] font-black tracking-[2px] text-[#FACC15]">
              SERIES
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <SeriesBadge
              label={items_base.name}
              type={anime.type}
              sub={`${anime.episodes ?? "?"}화 · ${anime.year ?? "?"}`}
              color={ACCENT_COLORS[0]}
              isCurrent
            />
            {sequels.map((seq, i) => (
              <div key={seq.items_base.id} className="flex items-center gap-2">
                <span className="font-neo-heading text-lg font-black">→</span>
                <SeriesBadge
                  label={seq.items_base.name}
                  type={seq.anime.type}
                  sub={
                    seq.anime.status === "Not yet aired"
                      ? "예정"
                      : `${seq.anime.episodes ?? "?"}화 · ${seq.anime.year ?? "?"}`
                  }
                  color={ACCENT_COLORS[(i + 1) % ACCENT_COLORS.length]}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Characters Preview */}
      {characters.length > 0 && (
        <div className="space-y-2.5 px-5 pt-4">
          <div className="flex items-center justify-between">
            <div
              className="inline-block rounded-md bg-[#1a1a1a] px-3 py-1"
              style={{ transform: "rotate(-1deg)" }}
            >
              <span className="font-neo-heading text-[10px] font-black tracking-[2px] text-[#4ADE80]">
                CHARACTERS
              </span>
            </div>
            <button
              onClick={() => onViewAllCharacters(animeId)}
              className="flex items-center gap-1 text-xs font-semibold text-gray-400 transition-colors hover:text-gray-600"
            >
              전체보기 →
            </button>
          </div>

          <div className="flex gap-2.5 overflow-x-auto pb-1">
            {characters.slice(0, 8).map((char, i) => (
              <div
                key={char.id}
                className="border-neo-border w-[100px] shrink-0 overflow-hidden rounded-xl border-2 shadow-[4px_4px_0_#1a1a1a]"
              >
                <div
                  className="flex h-[80px] items-center justify-center overflow-hidden"
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
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Relationship Graph */}
      {graphData && (
        <div className="px-5 pt-4 pb-5">
          {graphData.nodes.length > 0 ? (
            <RelationshipGraph data={graphData} />
          ) : graphData.arcs.length > 0 ? (
            <div className="space-y-3">
              <div
                className="inline-block rounded-md bg-[#1a1a1a] px-3 py-1"
                style={{ transform: "rotate(1deg)" }}
              >
                <span className="font-neo-heading text-[10px] font-black tracking-[2px] text-[#FF6B6B]">
                  RELATIONSHIP
                </span>
              </div>
              <div className="border-neo-border flex flex-col items-center justify-center rounded-xl border-3 bg-gray-50 py-10">
                <span className="text-3xl">🕸️</span>
                <p className="mt-2 text-sm font-semibold text-gray-400">
                  캐릭터 관계 데이터 준비 중...
                </p>
                <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                  {graphData.arcs.map((arc) => (
                    <span
                      key={arc.id}
                      className="border-neo-border rounded-lg border-2 bg-white px-2.5 py-1 text-[10px] font-bold"
                    >
                      {arc.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* MAL Link */}
      {anime.malUrl && (
        <div className="px-5 pb-5">
          <a
            href={anime.malUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="neo-btn bg-neo-primary text-neo-text border-neo-border shadow-neo-md hover:shadow-neo-sm flex h-[52px] items-center justify-center gap-2.5 rounded-xl border-3 text-[15px] font-black no-underline transition-all hover:translate-y-[1px]"
          >
            <span>↗</span>
            MyAnimeList에서 보기
          </a>
        </div>
      )}
    </div>
  );
}

function MetaBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-neo-border rounded-[10px] border-2 bg-[#FEF9C3] px-4 py-2.5 shadow-[3px_3px_0_#1a1a1a]">
      <p className="text-[9px] font-semibold text-gray-400">{label}</p>
      <p className="font-neo-heading text-sm font-bold">{value}</p>
    </div>
  );
}

function SeriesBadge({
  label,
  type,
  sub,
  color,
  isCurrent,
}: {
  label: string;
  type: string;
  sub: string;
  color: string;
  isCurrent?: boolean;
}) {
  return (
    <div
      className="border-neo-border space-y-0.5 rounded-[10px] border-2 px-4 py-2.5"
      style={{
        backgroundColor: isCurrent ? color : "#FFFFFF",
        boxShadow: `3px 3px 0 ${isCurrent ? "#1a1a1a" : "#CCCCCC"}`,
      }}
    >
      <div className="border-neo-border inline-block rounded bg-white px-1.5 py-0.5 border text-[9px] font-bold">
        {type}
      </div>
      <p className="font-neo-heading text-xs font-bold">{label}</p>
      <p className="text-[9px] text-gray-500">{sub}</p>
    </div>
  );
}
