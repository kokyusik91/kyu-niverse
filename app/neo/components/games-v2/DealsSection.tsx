"use client";

import { useQuery } from "@tanstack/react-query";
import { Flame, Tag, ExternalLink } from "lucide-react";
import { fetchSteamDeals, fetchPsnDeals, formatDealPrice } from "./api";
import type { DealItem } from "./types";

function discountBadgeColor(percent: number): string {
  if (percent >= 80) return "bg-[#51CF66]";
  if (percent >= 50) return "bg-[#FFE66D] text-[#1A1A2E]";
  return "bg-[#FF922B]";
}

function DealRow({ deal }: { deal: DealItem }) {
  const salePriceFormatted = formatDealPrice(deal.store, deal.salePrice, deal.region);
  const basePriceFormatted = formatDealPrice(deal.store, deal.basePrice, deal.region);

  return (
    <a
      href={deal.storeUrl ?? "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2.5 rounded-lg border-2 border-[#1A1A2E] bg-white p-2.5 transition-colors hover:bg-gray-50"
    >
      <div className="size-[50px] shrink-0 overflow-hidden rounded-md bg-gray-100">
        {deal.imageUrl ? (
          <img
            src={deal.imageUrl}
            alt={deal.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-gray-300">
            ?
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="truncate font-['Space_Grotesk'] text-xs font-bold text-[#1A1A2E]">
          {deal.name}
        </p>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-gray-400 line-through">
            {basePriceFormatted}
          </span>
          <span className="font-mono text-xs font-bold text-[#1A1A2E]">
            {salePriceFormatted}
          </span>
          {deal.storeUrl && <ExternalLink className="size-3 text-gray-300" />}
        </div>
      </div>
      <span
        className={`shrink-0 rounded px-2 py-1 font-mono text-xs font-bold text-white ${discountBadgeColor(deal.discountPercent)}`}
      >
        -{deal.discountPercent}%
      </span>
    </a>
  );
}

function DealColumn({
  icon,
  title,
  color,
  deals,
  isLoading,
}: {
  icon: React.ReactNode;
  title: string;
  color: string;
  deals: DealItem[];
  isLoading: boolean;
}) {
  return (
    <div className="flex-1 space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-['Space_Grotesk'] text-base font-bold text-[#1A1A2E]">
            {title}
          </span>
          {!isLoading && (
            <span
              className={`rounded-full ${color} px-2 py-0.5 font-mono text-[10px] font-bold text-white`}
            >
              {deals.length}
            </span>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-[70px] animate-pulse rounded-lg border-2 border-gray-200 bg-gray-50"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2.5">
          {deals.map((deal) => (
            <DealRow key={deal.id} deal={deal} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function DealsSection() {
  const { data: steamDeals = [], isLoading: steamLoading } = useQuery({
    queryKey: ["steam-deals"],
    queryFn: fetchSteamDeals,
  });

  const { data: psnDeals = [], isLoading: psnLoading } = useQuery({
    queryKey: ["psn-deals"],
    queryFn: fetchPsnDeals,
  });

  return (
    <div className="grid grid-cols-2">
      <div className="border-r-2 border-[#1A1A2E] p-5">
        <DealColumn
          icon={<Flame className="size-[18px] text-[#339AF0]" />}
          title="Steam Deals"
          color="bg-[#FF6B6B]"
          deals={steamDeals}
          isLoading={steamLoading}
        />
      </div>
      <div className="p-5">
        <DealColumn
          icon={<Tag className="size-[18px] text-[#7048E8]" />}
          title="PSN Deals"
          color="bg-[#7048E8]"
          deals={psnDeals}
          isLoading={psnLoading}
        />
      </div>
    </div>
  );
}
