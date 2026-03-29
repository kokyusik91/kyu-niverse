"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCharacters, fetchAnimeList } from "./api";
import type { Character, AnimeItem } from "./types";
import CharacterDetailDialog from "./CharacterDetailDialog";
import { Search } from "lucide-react";

const CHARACTER_COLORS = [
  "#FF6B6B",
  "#C4B5FD",
  "#93C5FD",
  "#4ADE80",
  "#FACC15",
  "#F472B6",
  "#FB923C",
  "#34D399",
];

export default function AnimeCharactersView() {
  const [selectedAnimeId, setSelectedAnimeId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: animeData } = useQuery({
    queryKey: ["anime-list"],
    queryFn: fetchAnimeList,
  });

  const myAnime = animeData?.data ?? [];
  const activeAnimeId = selectedAnimeId ?? myAnime[0]?.items_base.id;

  const { data: charData, isLoading } = useQuery({
    queryKey: ["anime-characters", activeAnimeId],
    queryFn: () => fetchCharacters(activeAnimeId!),
    enabled: !!activeAnimeId,
  });

  const characters = charData?.data ?? [];
  const filtered = search
    ? characters.filter(
        (c) =>
          c.nameKr?.includes(search) ||
          c.nameEn?.toLowerCase().includes(search.toLowerCase()) ||
          c.nameJp?.includes(search),
      )
    : characters;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Anime selector */}
      <div className="border-neo-border flex flex-wrap items-center gap-2 border-b-3 bg-gray-50 px-5 py-3">
        {myAnime.map((a) => (
          <button
            key={a.items_base.id}
            onClick={() => setSelectedAnimeId(a.items_base.id)}
            className={`border-neo-border rounded-lg border-2 px-3 py-1.5 text-xs font-bold transition-all ${
              a.items_base.id === activeAnimeId
                ? "bg-neo-primary shadow-[3px_3px_0_#1a1a1a]"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {a.items_base.name}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="border-neo-border border-b-3 px-5 py-2.5">
        <div className="border-neo-border flex items-center gap-2 rounded-lg border-2 bg-white px-3 py-2">
          <Search size={14} className="text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="캐릭터 검색..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-300"
          />
        </div>
      </div>

      {/* Characters grid */}
      <div className="neo-scrollbar flex-1 overflow-y-auto p-5">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <span className="text-sm font-semibold text-gray-400">
              불러오는 중...
            </span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <span className="text-sm text-gray-400">
              캐릭터가 없습니다.
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filtered.map((char, i) => (
              <button
                key={char.id}
                onClick={() => {
                  setSelectedChar(char);
                  setDialogOpen(true);
                }}
                className="border-neo-border overflow-hidden rounded-xl border-2 text-left transition-transform hover:scale-[1.03]"
                style={{
                  boxShadow: "4px 4px 0 #1a1a1a",
                }}
              >
                <div
                  className="flex h-[100px] items-center justify-center overflow-hidden"
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
                    <span className="text-3xl opacity-40">👤</span>
                  )}
                </div>
                <div className="bg-white p-2 text-center">
                  <p className="font-neo-heading truncate text-xs font-bold">
                    {char.nameKr ?? char.nameEn}
                  </p>
                  <p className="truncate text-[10px] text-gray-400">
                    {char.role}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <CharacterDetailDialog
        character={selectedChar}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
