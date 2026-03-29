"use client";

import { useState } from "react";
import QueryProvider from "../instagram/QueryProvider";
import AnimeListView from "./AnimeListView";
import AnimeDetailView from "./AnimeDetailView";
import AnimeCharactersView from "./AnimeCharactersView";
import type { AnimeTab, AnimeViewState } from "./types";
import { Search } from "lucide-react";

function AnimeExplorer() {
  const [tab, setTab] = useState<AnimeTab>("anime");
  const [viewState, setViewState] = useState<AnimeViewState>({ view: "list" });

  const handleSelectAnime = (id: number) => {
    setViewState({ view: "detail", animeId: id });
  };

  const handleBack = () => {
    setViewState({ view: "list" });
  };

  const handleViewAllCharacters = (animeId: number) => {
    setTab("characters");
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="border-neo-border flex h-[52px] shrink-0 items-center justify-between bg-[#FF6B6B] px-5"
        style={{ borderBottomWidth: "3px" }}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🎬</span>
          <span className="font-neo-heading text-neo-text text-xl font-black">
            ANIME
          </span>
          <span className="border-neo-border rounded-full bg-[#1a1a1a] px-2.5 py-0.5 text-[10px] font-bold text-white"
            style={{ transform: "rotate(-2deg)" }}
          >
            616
          </span>
        </div>

        {/* Tab toggle */}
        <div className="border-neo-border flex rounded-lg border-2 bg-white">
          <button
            onClick={() => {
              setTab("anime");
              setViewState({ view: "list" });
            }}
            className={`px-3 py-1.5 text-xs font-bold transition-colors ${
              tab === "anime"
                ? "bg-[#1a1a1a] text-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
            style={{
              borderRadius: tab === "anime" ? "6px" : "6px 0 0 6px",
            }}
          >
            애니
          </button>
          <button
            onClick={() => setTab("characters")}
            className={`px-3 py-1.5 text-xs font-bold transition-colors ${
              tab === "characters"
                ? "bg-[#1a1a1a] text-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
            style={{
              borderRadius: tab === "characters" ? "6px" : "0 6px 6px 0",
            }}
          >
            캐릭터
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden bg-[#FEF9C3]">
        {tab === "anime" ? (
          viewState.view === "list" ? (
            <AnimeListView onSelectAnime={handleSelectAnime} />
          ) : viewState.view === "detail" ? (
            <AnimeDetailView
              animeId={viewState.animeId}
              onBack={handleBack}
              onViewAllCharacters={handleViewAllCharacters}
            />
          ) : null
        ) : (
          <AnimeCharactersView />
        )}
      </div>
    </div>
  );
}

export default function AnimeContent() {
  return (
    <QueryProvider>
      <AnimeExplorer />
    </QueryProvider>
  );
}
