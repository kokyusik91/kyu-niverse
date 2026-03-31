"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useQuery } from "@tanstack/react-query";
import type { Character, CharacterSummary } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_KYUNO_API_URL;

interface CharacterDetailDialogProps {
  character: Character | CharacterSummary | null;
  animeId?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function isFullCharacter(c: Character | CharacterSummary): c is Character {
  return "voiceActorJp" in c;
}

async function fetchCharacterDetail(
  animeId: number,
  charId: number,
): Promise<Character> {
  const res = await fetch(
    `${API_BASE}/api/anime/${animeId}/characters/${charId}`,
  );
  if (!res.ok) throw new Error("Failed to fetch character detail");
  const json = await res.json();
  return json.data;
}

export default function CharacterDetailDialog({
  character,
  animeId,
  open,
  onOpenChange,
}: CharacterDetailDialogProps) {
  const [showOriginal, setShowOriginal] = useState(false);

  const needsFetch = !!character && !isFullCharacter(character) && !!animeId;

  const { data: fullCharacter } = useQuery({
    queryKey: ["character-detail", animeId, character?.id],
    queryFn: () => fetchCharacterDetail(animeId!, character!.id),
    enabled: open && needsFetch,
  });

  if (!character) return null;

  const char: Character | CharacterSummary = fullCharacter ?? character;
  const displayName = char.nameKr ?? char.nameEn ?? "Unknown";
  const full = isFullCharacter(char) ? char : null;
  const hasDescription = full?.description || full?.descriptionKr;
  const descriptionText = showOriginal
    ? full?.description
    : (full?.descriptionKr ?? full?.description);

  const roleTag =
    char.role === "Main"
      ? "주인공"
      : char.role === "Supporting"
        ? "조연"
        : char.role;
  const roleBg = char.role === "Main" ? "bg-[#FEF9C3]" : "bg-[#E0F2FE]";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[460px] overflow-hidden rounded-2xl border-3 border-[#1a1a1a] bg-white p-0 text-[#1a1a1a] shadow-[6px_6px_0_#1a1a1a] [&>button:last-child]:hidden">
        <VisuallyHidden>
          <DialogTitle>{displayName} 상세</DialogTitle>
        </VisuallyHidden>

        <div className="scrollbar-hide flex max-h-[80vh] flex-col overflow-y-auto">
          {/* Banner + Avatar */}
          <div className="relative">
            {/* Banner */}
            <div className="h-[120px] w-full overflow-hidden bg-gradient-to-br from-[#1a1a2e] to-[#2d2b55]">
              {char.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={char.imageUrl}
                  alt=""
                  className="h-full w-full object-cover opacity-40 blur-sm"
                />
              )}
              <div className="absolute inset-x-0 top-0 h-[120px] bg-gradient-to-b from-[#1a1a2e40] to-[#1a1a2ecc]" />
            </div>

            {/* Avatar - overlapping banner */}
            <div className="absolute top-[55px] left-1/2 -translate-x-1/2">
              <div className="flex h-[120px] w-[120px] items-center justify-center overflow-hidden rounded-full border-3 border-[#1a1a1a] bg-white shadow-[4px_4px_0_#1a1a1a]">
                {char.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={char.imageUrl}
                    alt={displayName}
                    className="h-[110px] w-[110px] rounded-full object-cover"
                  />
                ) : (
                  <span className="text-4xl text-gray-300">👤</span>
                )}
              </div>
            </div>
          </div>

          {/* Name & Tags Section */}
          <div className="flex flex-col items-center gap-2 px-7 pt-[60px] pb-2">
            <h2 className="font-neo-heading text-[22px] font-extrabold text-[#1a1a1a]">
              {displayName}
            </h2>
            <p className="text-xs font-medium text-gray-400">
              {[char.nameEn, char.nameJp].filter(Boolean).join(" · ")}
            </p>

            {/* Tags */}
            <div className="mt-1 flex items-center gap-1.5">
              {roleTag && (
                <span
                  className={`rounded-md border-2 border-[#1a1a1a] ${roleBg} px-2.5 py-0.5 text-[10px] font-bold text-[#1a1a1a]`}
                >
                  {roleTag}
                </span>
              )}
              {full?.species && (
                <span className="rounded-md border-2 border-[#1a1a1a] bg-[#FF6B6B] px-2.5 py-0.5 text-[10px] font-bold text-white">
                  {full.species}
                </span>
              )}
              {char.gender && (
                <span className="rounded-md border-2 border-[#1a1a1a] bg-[#C4B5FD] px-2.5 py-0.5 text-[10px] font-bold text-[#1a1a1a]">
                  {char.gender === "Male"
                    ? "남"
                    : char.gender === "Female"
                      ? "여"
                      : char.gender}
                </span>
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className="flex flex-col gap-3.5 px-7 pt-2 pb-6">
            {/* Stats Row */}
            <div className="flex gap-2.5">
              {char.favorites != null && (
                <StatCard
                  value={char.favorites.toLocaleString()}
                  label="인기도"
                  valueColor="text-[#FF6B6B]"
                />
              )}
              {full?.age && <StatCard value={full.age} label="나이" />}
              {char.role && (
                <StatCard
                  value={
                    char.role === "Main"
                      ? "주요"
                      : char.role === "Supporting"
                        ? "조연"
                        : char.role
                  }
                  label="역할"
                  valueColor="text-[#C084FC]"
                />
              )}
            </div>

            {/* Voice Actors */}
            {full &&
              (full.voiceActorJp || full.voiceActorEn || full.voiceActorKr) && (
                <>
                  <div className="h-px w-full bg-gray-200" />
                  <div className="rounded-[10px] border border-gray-200 bg-[#F9FAFB] p-3">
                    <p className="mb-1.5 text-[9px] font-bold tracking-[1.5px] text-gray-400">
                      VOICE ACTORS
                    </p>
                    <div className="space-y-1">
                      {full.voiceActorJp && (
                        <VoiceActorRow lang="JP" name={full.voiceActorJp} />
                      )}
                      {full.voiceActorEn && (
                        <VoiceActorRow lang="EN" name={full.voiceActorEn} />
                      )}
                      {full.voiceActorKr && (
                        <VoiceActorRow lang="KR" name={full.voiceActorKr} />
                      )}
                    </div>
                  </div>
                </>
              )}

            {/* Description */}
            {hasDescription && (
              <>
                <div className="h-px w-full bg-gray-200" />
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-[9px] font-bold tracking-[1.5px] text-gray-400">
                      DESCRIPTION
                    </p>
                    {full?.description && full?.descriptionKr && (
                      <button
                        type="button"
                        onClick={() => setShowOriginal((prev) => !prev)}
                        className="rounded-md border-2 border-[#1a1a1a] bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-[#1a1a1a] transition-colors hover:bg-gray-200"
                      >
                        {showOriginal ? "KR" : "EN"}
                      </button>
                    )}
                  </div>
                  <p className="text-xs leading-relaxed text-gray-600">
                    {descriptionText}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function StatCard({
  value,
  label,
  valueColor = "text-[#1a1a1a]",
}: {
  value: string;
  label: string;
  valueColor?: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center gap-0.5 rounded-lg border border-gray-200 bg-[#F9FAFB] px-4 py-2">
      <span className={`text-lg font-extrabold ${valueColor}`}>{value}</span>
      <span className="text-[10px] font-medium text-gray-400">{label}</span>
    </div>
  );
}

function VoiceActorRow({ lang, name }: { lang: string; name: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="font-extrabold text-[#1a1a1a]">{lang}</span>
      <span className="font-medium text-[#444]">{name}</span>
    </div>
  );
}
