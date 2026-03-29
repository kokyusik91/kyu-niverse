"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import type { Character } from "./types";

interface CharacterDetailDialogProps {
  character: Character | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CharacterDetailDialog({
  character,
  open,
  onOpenChange,
}: CharacterDetailDialogProps) {
  if (!character) return null;

  const displayName = character.nameKr ?? character.nameEn ?? "Unknown";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-neo-border shadow-neo-lg max-w-[440px] overflow-hidden rounded-2xl border-[5px] bg-white p-0 [&>button:last-child]:hidden">
        <VisuallyHidden>
          <DialogTitle>{displayName} 상세</DialogTitle>
        </VisuallyHidden>

        <div className="flex gap-0">
          {/* Character image */}
          <div className="border-neo-border h-[320px] w-[160px] shrink-0 overflow-hidden border-r-3 bg-gray-100">
            {character.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={character.imageUrl}
                alt={displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-4xl text-gray-300">
                👤
              </div>
            )}
          </div>

          {/* Character info */}
          <div className="neo-scrollbar flex-1 overflow-y-auto p-4">
            <h2 className="font-neo-heading text-lg font-black">
              {displayName}
            </h2>
            <p className="mt-0.5 text-xs text-gray-400">
              {[character.nameEn, character.nameJp]
                .filter(Boolean)
                .join(" · ")}
            </p>

            <div className="mt-4 space-y-2.5">
              {character.role && (
                <InfoRow label="역할" value={character.role} />
              )}
              {character.gender && (
                <InfoRow label="성별" value={character.gender} />
              )}
              {character.species && (
                <InfoRow label="종족" value={character.species} />
              )}
              {character.age && (
                <InfoRow label="나이" value={character.age} />
              )}
              {character.favorites != null && (
                <InfoRow
                  label="즐겨찾기"
                  value={character.favorites.toLocaleString()}
                />
              )}
            </div>

            {/* Voice actors */}
            {(character.voiceActorJp ||
              character.voiceActorEn ||
              character.voiceActorKr) && (
              <div className="border-neo-border mt-4 rounded-lg border-2 bg-gray-50 p-3">
                <p className="font-neo-heading mb-2 text-[10px] font-black tracking-[2px] text-gray-400">
                  VOICE ACTORS
                </p>
                <div className="space-y-1 text-xs">
                  {character.voiceActorJp && (
                    <p>
                      <span className="font-bold text-gray-500">JP</span>{" "}
                      {character.voiceActorJp}
                    </p>
                  )}
                  {character.voiceActorEn && (
                    <p>
                      <span className="font-bold text-gray-500">EN</span>{" "}
                      {character.voiceActorEn}
                    </p>
                  )}
                  {character.voiceActorKr && (
                    <p>
                      <span className="font-bold text-gray-500">KR</span>{" "}
                      {character.voiceActorKr}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* MAL link */}
            {character.malUrl && (
              <a
                href={character.malUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="neo-btn bg-neo-accent text-neo-text border-neo-border shadow-neo-sm hover:shadow-none mt-4 flex h-9 items-center justify-center gap-1.5 rounded-lg border-2 text-xs font-bold no-underline transition-all hover:translate-y-[1px]"
              >
                <span>↗</span>
                MAL에서 보기
              </a>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-14 shrink-0 font-bold text-gray-400">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
