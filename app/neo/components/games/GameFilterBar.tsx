import { Clock, Star, ArrowDownAZ, Calendar } from "lucide-react";
import type { ReactNode } from "react";
import type { SortKey } from "./types";

const SORT_ICONS: Record<SortKey, ReactNode> = {
  playHours: <Clock className="size-4" />,
  metacritic: <Star className="size-4" />,
  name: <ArrowDownAZ className="size-4" />,
  releasedAt: <Calendar className="size-4" />,
};

const SORT_LABELS: Record<SortKey, string> = {
  playHours: "Play Time",
  metacritic: "Metacritic",
  name: "Name",
  releasedAt: "Release",
};

const SORT_ORDER: SortKey[] = ["playHours", "metacritic", "name", "releasedAt"];

interface GameFilterBarProps {
  genres: string[];
  selectedGenre: string | null;
  onSelectGenre: (genre: string | null) => void;
  sortKey: SortKey;
  onSortChange: (key: SortKey) => void;
}

export default function GameFilterBar({
  genres,
  selectedGenre,
  onSelectGenre,
  sortKey,
  onSortChange,
}: GameFilterBarProps) {
  const handleSortCycle = () => {
    const currentIndex = SORT_ORDER.indexOf(sortKey);
    const nextIndex = (currentIndex + 1) % SORT_ORDER.length;
    onSortChange(SORT_ORDER[nextIndex]);
  };

  return (
    <div className="flex items-center justify-between h-[52px] px-3 border-b-3 border-neo-border md:px-5">
      <div className="scrollbar-hide flex min-w-0 flex-1 gap-2 overflow-x-auto">
        {["All", ...genres].map((genre) => {
          const isActive = genre === "All" ? selectedGenre === null : selectedGenre === genre;
          return (
            <button
              key={genre}
              type="button"
              onClick={() => onSelectGenre(genre === "All" ? null : genre)}
              className={`h-8 shrink-0 px-3.5 rounded-md border-2 border-neo-border font-neo-heading text-xs transition-colors ${
                isActive
                  ? "bg-neo-text text-white"
                  : "bg-white text-neo-text shadow-neo-sm hover:bg-neo-bg"
              }`}
            >
              {genre}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={handleSortCycle}
        title={SORT_LABELS[sortKey]}
        className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-neo-border bg-neo-accent text-neo-text shadow-neo-sm hover:bg-neo-secondary transition-colors"
      >
        {SORT_ICONS[sortKey]}
      </button>
    </div>
  );
}
