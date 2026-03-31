"use client";

import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarClock, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { fetchUpcoming } from "./api";
import type { UpcomingItem } from "./types";

function UpcomingCard({ item }: { item: UpcomingItem }) {
  return (
    <div className="w-[180px] shrink-0 overflow-hidden rounded-lg border-2 border-[#1A1A2E] bg-white shadow-[3px_3px_0_#1A1A2E]">
      <div className="h-[100px] overflow-hidden bg-gray-100">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <CalendarClock className="size-8 text-gray-300" />
          </div>
        )}
      </div>
      <div className="space-y-1.5 p-2.5">
        <p className="truncate font-['Space_Grotesk'] text-xs font-bold text-[#1A1A2E]">
          {item.name}
        </p>
        <p className="truncate font-mono text-[10px] text-gray-400">
          {item.genre.slice(0, 2).join(", ")}
        </p>
        <div className="flex items-center justify-between">
          {item.releasedAt ? (
            <span className="rounded bg-[#7048E8] px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
              {item.releasedAt}
            </span>
          ) : (
            <span className="rounded bg-gray-200 px-1.5 py-0.5 font-mono text-[10px] font-bold text-gray-500">
              TBA
            </span>
          )}
          {item.rating != null && (
            <span className="flex items-center gap-0.5 font-mono text-[10px] text-gray-500">
              <Star className="size-3 fill-[#FFE66D] text-[#FFE66D]" />
              {item.rating}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function UpcomingSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: upcoming = [], isLoading } = useQuery({
    queryKey: ["game-upcoming"],
    queryFn: fetchUpcoming,
  });

  const scroll = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -380 : 380,
      behavior: "smooth",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-3 border-b-2 border-[#1A1A2E] p-5">
        <div className="h-7 w-56 animate-pulse rounded bg-gray-100" />
        <div className="flex gap-3.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-[170px] w-[180px] shrink-0 animate-pulse rounded-lg border-2 border-gray-200 bg-gray-50"
            />
          ))}
        </div>
      </div>
    );
  }

  if (upcoming.length === 0) return null;

  return (
    <div className="border-b-2 border-[#1A1A2E] p-5">
      <div className="mb-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <CalendarClock className="size-7 text-[#7048E8]" strokeWidth={2.5} />
          <span className="font-['Space_Grotesk'] text-[22px] font-bold text-[#1A1A2E]">
            Upcoming PS5
          </span>
          <span className="rounded-full bg-[#7048E8] px-2 py-0.5 font-mono text-[10px] font-bold text-white">
            {upcoming.length}
          </span>
        </div>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => scroll("left")}
            className="flex size-7 items-center justify-center rounded-md border-2 border-[#1A1A2E] bg-white shadow-[2px_2px_0_#1A1A2E] transition-colors hover:bg-gray-50"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            className="flex size-7 items-center justify-center rounded-md border-2 border-[#1A1A2E] bg-white shadow-[2px_2px_0_#1A1A2E] transition-colors hover:bg-gray-50"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="neo-scrollbar flex gap-3.5 overflow-x-auto pb-2"
      >
        {upcoming.map((item) => (
          <UpcomingCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
