"use client";

import QueryProvider from "../instagram/QueryProvider";
import StatCards from "./StatCards";
import UpcomingSection from "./UpcomingSection";
import MyGamesSection from "./MyGamesSection";
import RankingsSection from "./RankingsSection";
import DealsSection from "./DealsSection";

function GamesExplorer() {
  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#FAF5EE]">
      <div className="neo-scrollbar flex-1 overflow-y-auto">
        <StatCards />
        <UpcomingSection />
        <MyGamesSection />
        <RankingsSection />
        <DealsSection />
      </div>
    </div>
  );
}

export default function GamesV2Content() {
  return (
    <QueryProvider>
      <GamesExplorer />
    </QueryProvider>
  );
}
