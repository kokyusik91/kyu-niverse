"use client";

import { useState } from "react";
import QueryProvider from "../instagram/QueryProvider";
import AnimeListView from "./AnimeListView";
import AnimeDetailView from "./AnimeDetailView";
import AnimeCharactersView from "./AnimeCharactersView";
import UpcomingListView from "./UpcomingListView";
import type { AnimeTab, AnimeViewState } from "./types";

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

  const isRootView = tab === "anime" ? viewState.view === "list" : true;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Tab toggle — 루트 뷰에서만 노출 */}
      {isRootView && (
        <div className="shrink-0 bg-[#FEF9C3] px-5 py-4">
          <div className="border-neo-border inline-flex rounded-lg border-2 bg-white">
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
      )}

      {/* Content */}
      <div className="flex-1 overflow-hidden bg-[#FEF9C3]">
        {tab === "anime" ? (
          viewState.view === "list" ? (
            <AnimeListView
              onSelectAnime={handleSelectAnime}
              onViewAllUpcoming={() => setViewState({ view: "upcoming" })}
            />
          ) : viewState.view === "upcoming" ? (
            <UpcomingListView onBack={() => setViewState({ view: "list" })} />
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
