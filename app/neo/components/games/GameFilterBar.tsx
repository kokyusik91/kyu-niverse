import type { SortKey } from "./types";

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
    <div className="flex items-center justify-between h-[52px] px-5 border-b-3 border-neo-border">
      <div className="flex gap-2">
        {["All", ...genres].map((genre) => {
          const isActive = genre === "All" ? selectedGenre === null : selectedGenre === genre;
          return (
            <button
              key={genre}
              type="button"
              onClick={() => onSelectGenre(genre === "All" ? null : genre)}
              className={`h-8 px-3.5 rounded-md border-2 border-neo-border font-neo-heading text-xs transition-colors ${
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
        className="h-8 px-3.5 rounded-md border-2 border-neo-border bg-white text-neo-text font-neo-heading text-xs shadow-neo-sm hover:bg-neo-bg transition-colors flex items-center gap-1.5"
      >
        <span className="text-[10px]">↕</span>
        {SORT_LABELS[sortKey]}
      </button>
    </div>
  );
}
