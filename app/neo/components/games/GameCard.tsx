"use client";

import type { GameItem } from "./types";
import GamesIcon from "../icons/GamesIcon";

export default function GameCard({ game }: { game: GameItem }) {
  return (
    <div className="bg-neo-surface border-neo-border shadow-neo-md overflow-hidden rounded-lg border-3">
      <div className="h-[150px] overflow-hidden">
        {game.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={game.imageUrl}
            alt={game.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200">
            <GamesIcon size={48} />
          </div>
        )}
      </div>

      <div className="space-y-1.5 p-3">
        <h3 className="font-space-grotesk text-neo-text truncate text-sm font-bold">
          {game.name}
        </h3>

        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-neo-primary font-neo-heading rounded px-2 py-0.5 text-[10px] text-white">
            {game.playHours}h
          </span>
          <span className="bg-neo-bg text-neo-text font-neo-heading border-neo-border rounded border px-2 py-0.5 text-[10px]">
            {game.genre.slice(0, 2).join(" ")}
          </span>
          {game.metacritic != null && (
            <span className="bg-neo-success font-neo-heading rounded px-2 py-0.5 text-[10px] text-white">
              {game.metacritic}
            </span>
          )}
        </div>

        <div className="flex justify-between">
          <span className="font-neo-heading text-[11px] text-gray-400">
            {game.platform}
          </span>
          <span className="font-neo-heading text-[11px] text-gray-400">
            {game.releasedAt?.slice(0, 4)}
          </span>
        </div>
      </div>
    </div>
  );
}
