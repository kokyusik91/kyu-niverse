"use client";

import { useState, lazy, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plane, RefreshCw, MapPin, ArrowUp, X, List, Map } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import QueryProvider from "../instagram/QueryProvider";
import {
  type Aircraft,
  type ApiResponse,
  LOCATIONS,
  CATEGORY_LABELS,
  POLL_INTERVAL_MS,
  getCountry,
  getAirline,
  getFlightLabel,
  formatAltitude,
  formatSpeed,
  fetchAircraft,
} from "./flight-radar-utils";

const FlightRadarMap = lazy(() => import("./FlightRadarMap"));

function getEmergencyBadge(ac: Aircraft) {
  if (!ac.emergency || ac.emergency === "none") return null;
  return (
    <span className="border-neo-border ml-1 inline-block rounded-md border-2 bg-[#FF6B6B] px-1.5 py-0.5 text-[9px] font-bold text-white">
      {ac.squawk === "7700" ? "MAYDAY" : ac.emergency.toUpperCase()}
    </span>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | number | undefined | null;
}) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex items-center justify-between border-b border-dashed border-gray-200 py-1.5">
      <span className="text-[11px] font-bold text-gray-400">{label}</span>
      <span className="font-neo-heading text-neo-text text-[12px] font-bold">{value}</span>
    </div>
  );
}

function AircraftDetailDialog({
  ac,
  open,
  onOpenChange,
}: {
  ac: Aircraft | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!ac) return null;

  const country = getCountry(ac.r);
  const categoryLabel = ac.category ? CATEGORY_LABELS[ac.category] : null;
  const isGround = ac.alt_baro === "ground";
  const climbRate = ac.baro_rate ?? ac.geom_rate;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-neo-border shadow-neo-lg max-h-[80vh] max-w-[420px] overflow-y-auto rounded-2xl border-3 bg-white p-0 [&>button:last-child]:hidden">
        <VisuallyHidden>
          <DialogTitle>{getFlightLabel(ac)}</DialogTitle>
        </VisuallyHidden>

        {/* Header */}
        <div className="border-neo-border border-b-3 bg-[#E8F4FD] px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="border-neo-border inline-flex size-10 items-center justify-center rounded-xl border-3 bg-white text-lg">
                ✈️
              </span>
              <div>
                <div className="font-neo-heading text-neo-text text-lg font-bold">
                  {getFlightLabel(ac)}
                </div>
                {getAirline(ac) && (
                  <div className="text-[12px] font-semibold text-gray-700">
                    {getAirline(ac)}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="border-neo-border shadow-neo-xs rounded-lg border-2 bg-[#FF6B6B] p-1.5 transition-all hover:bg-[#ff5252] active:translate-y-0.5 active:shadow-none"
            >
              <X className="size-4 text-white" />
            </button>
          </div>

          {/* Tags */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {ac.t && (
              <span className="border-neo-border rounded-lg border-2 bg-[#339AF0] px-2 py-0.5 text-[10px] font-bold text-white">
                {ac.t}
              </span>
            )}
            {categoryLabel && (
              <span className="border-neo-border rounded-lg border-2 bg-[#FFE66D] px-2 py-0.5 text-[10px] font-bold">
                {categoryLabel}
              </span>
            )}
            {country && (
              <span className="border-neo-border rounded-lg border-2 bg-[#F8F9FA] px-2 py-0.5 text-[10px] font-bold text-neo-text">
                {country.flag} {country.name}
              </span>
            )}
            {isGround ? (
              <span className="border-neo-border rounded-lg border-2 bg-[#FFE3E3] px-2 py-0.5 text-[10px] font-bold text-red-800">
                지상
              </span>
            ) : (
              <span className="border-neo-border rounded-lg border-2 bg-[#D3F9D8] px-2 py-0.5 text-[10px] font-bold text-green-800">
                비행 중
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="space-y-4 px-5 py-4">
          {/* Aircraft Info */}
          <div>
            <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#339AF0]">
              기체 정보
            </div>
            <div className="border-neo-border rounded-xl border-3 bg-[#F8F9FA] p-3">
              <DetailRow label="항공사" value={getAirline(ac)} />
              <DetailRow label="기종" value={ac.desc} />
              <DetailRow label="ICAO 타입" value={ac.t} />
              <DetailRow label="등록번호" value={ac.r} />
              <DetailRow label="제조연도" value={ac.year} />
              <DetailRow label="HEX" value={ac.hex.toUpperCase()} />
              <DetailRow
                label="크기 분류"
                value={
                  categoryLabel ? `${ac.category} — ${categoryLabel}` : ac.category
                }
              />
            </div>
          </div>

          {/* Flight Data */}
          <div>
            <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#339AF0]">
              비행 데이터
            </div>
            <div className="border-neo-border rounded-xl border-3 bg-[#F8F9FA] p-3">
              <DetailRow
                label="기압 고도"
                value={formatAltitude(ac.alt_baro)}
              />
              <DetailRow
                label="기하 고도"
                value={
                  ac.alt_geom !== undefined
                    ? `${ac.alt_geom.toLocaleString()}ft`
                    : undefined
                }
              />
              <DetailRow label="대지속도 (GS)" value={formatSpeed(ac.gs)} />
              <DetailRow
                label="계기속도 (IAS)"
                value={ac.ias !== undefined ? `${ac.ias}kts` : undefined}
              />
              <DetailRow
                label="진대기속도 (TAS)"
                value={ac.tas !== undefined ? `${ac.tas}kts` : undefined}
              />
              <DetailRow
                label="마하"
                value={ac.mach !== undefined ? `M ${ac.mach}` : undefined}
              />
              <DetailRow
                label="방향"
                value={
                  ac.track !== undefined ? `${Math.round(ac.track)}°` : undefined
                }
              />
              <DetailRow
                label="상승/하강률"
                value={
                  climbRate !== undefined
                    ? `${climbRate > 0 ? "+" : ""}${climbRate}ft/min`
                    : undefined
                }
              />
              <DetailRow label="스쿼크" value={ac.squawk} />
              <DetailRow
                label="설정 고도"
                value={
                  ac.nav_altitude_mcp !== undefined
                    ? `${ac.nav_altitude_mcp.toLocaleString()}ft`
                    : undefined
                }
              />
              <DetailRow
                label="QNH"
                value={
                  ac.nav_qnh !== undefined ? `${ac.nav_qnh}hPa` : undefined
                }
              />
            </div>
          </div>

          {/* Environment */}
          {(ac.oat !== undefined || ac.wd !== undefined) && (
            <div>
              <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#339AF0]">
                환경
              </div>
              <div className="border-neo-border rounded-xl border-3 bg-[#F8F9FA] p-3">
                <DetailRow
                  label="외기온도 (OAT)"
                  value={ac.oat !== undefined ? `${ac.oat}°C` : undefined}
                />
                <DetailRow
                  label="전온도 (TAT)"
                  value={ac.tat !== undefined ? `${ac.tat}°C` : undefined}
                />
                <DetailRow
                  label="바람 방향"
                  value={ac.wd !== undefined ? `${ac.wd}°` : undefined}
                />
                <DetailRow
                  label="풍속"
                  value={ac.ws !== undefined ? `${ac.ws}kts` : undefined}
                />
              </div>
            </div>
          )}

          {/* Position */}
          {ac.lat && ac.lon && (
            <div>
              <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#339AF0]">
                위치
              </div>
              <div className="border-neo-border rounded-xl border-3 bg-[#F8F9FA] p-3">
                <DetailRow label="위도" value={ac.lat.toFixed(6)} />
                <DetailRow label="경도" value={ac.lon.toFixed(6)} />
                <DetailRow
                  label="신호 강도"
                  value={
                    ac.rssi !== undefined ? `${ac.rssi} dBFS` : undefined
                  }
                />
                <DetailRow
                  label="수신 메시지"
                  value={ac.messages?.toLocaleString()}
                />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AircraftCard({
  ac,
  onClick,
}: {
  ac: Aircraft;
  onClick: () => void;
}) {
  const isGround = ac.alt_baro === "ground";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`border-neo-border shadow-neo-xs w-full cursor-pointer rounded-xl border-3 p-3 text-left transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#1A1A2E] ${
        isGround ? "bg-[#F8F9FA]" : "bg-white"
      }`}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span
            className={`border-neo-border inline-flex size-6 items-center justify-center rounded-full border-2 text-[10px] ${
              isGround ? "bg-[#FFE3E3]" : "bg-[#D0EBFF]"
            }`}
          >
            ✈️
          </span>
          <span className="font-neo-heading text-[13px] font-bold">
            {getFlightLabel(ac)}
          </span>
          {getEmergencyBadge(ac)}
        </div>
        {ac.t && (
          <span className="border-neo-border rounded-lg border-2 bg-[#E8F4FD] px-2 py-0.5 text-[10px] font-bold text-[#339AF0]">
            {ac.t}
          </span>
        )}
      </div>

      {(ac.desc || getAirline(ac)) && (
        <p className="mb-2 text-[11px] text-gray-500">
          {[getAirline(ac), ac.desc].filter(Boolean).join(" · ")}
        </p>
      )}

      <div className="grid grid-cols-3 gap-2">
        <div className="border-neo-border rounded-lg border-2 bg-[#F8F9FA] px-2 py-1.5 text-center">
          <div className="text-[9px] font-bold text-gray-400">고도</div>
          <div className="font-neo-heading text-[12px] font-bold">
            {formatAltitude(ac.alt_baro)}
          </div>
        </div>
        <div className="border-neo-border rounded-lg border-2 bg-[#F8F9FA] px-2 py-1.5 text-center">
          <div className="text-[9px] font-bold text-gray-400">속도</div>
          <div className="font-neo-heading text-[12px] font-bold">
            {formatSpeed(ac.gs)}
          </div>
        </div>
        <div className="border-neo-border rounded-lg border-2 bg-[#F8F9FA] px-2 py-1.5 text-center">
          <div className="text-[9px] font-bold text-gray-400">방향</div>
          <div className="flex items-center justify-center gap-0.5">
            {ac.track !== undefined && (
              <ArrowUp
                className="size-3"
                style={{ transform: `rotate(${ac.track}deg)` }}
              />
            )}
            <span className="font-neo-heading text-[12px] font-bold">
              {ac.track !== undefined ? `${Math.round(ac.track)}°` : "-"}
            </span>
          </div>
        </div>
      </div>

      {ac.r && (
        <div className="mt-2 text-[10px] text-gray-400">
          등록번호: {ac.r}
        </div>
      )}
    </button>
  );
}

type ViewMode = "list" | "map";

function FlightRadarInner() {
  const [locationIdx, setLocationIdx] = useState(0);
  const [selectedAc, setSelectedAc] = useState<Aircraft | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const { data, isLoading, error, dataUpdatedAt, refetch, isFetching } =
    useQuery({
      queryKey: ["flight-radar", locationIdx],
      queryFn: () => fetchAircraft(locationIdx),
      refetchInterval: POLL_INTERVAL_MS,
      retry: 1,
      retryDelay: 15000,
      staleTime: POLL_INTERVAL_MS,
      refetchOnWindowFocus: false,
      placeholderData: (prev: ApiResponse | undefined) => prev,
    });

  const aircraft = (data?.ac || [])
    .filter((ac) => ac.lat && ac.lon)
    .sort((a, b) => {
      const altA = typeof a.alt_baro === "number" ? a.alt_baro : -1;
      const altB = typeof b.alt_baro === "number" ? b.alt_baro : -1;
      return altB - altA;
    });
  const total = data?.total || 0;
  const airborne = aircraft.filter((ac) => ac.alt_baro !== "ground").length;
  const onGround = aircraft.filter((ac) => ac.alt_baro === "ground").length;
  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt) : null;

  return (
    <div className="flex h-full flex-col bg-white">
      <AircraftDetailDialog
        ac={selectedAc}
        open={!!selectedAc}
        onOpenChange={(open) => {
          if (!open) setSelectedAc(null);
        }}
      />

      {/* Header */}
      <div className="border-neo-border flex items-center justify-between border-b-3 bg-[#E8F4FD] px-4 py-3">
        <div className="flex items-center gap-2">
          <Plane className="size-5 text-[#339AF0]" />
          <span className="font-neo-heading text-sm font-bold">
            Flight Radar
          </span>
          <span className="border-neo-border inline-flex items-center gap-1 rounded-full border-2 bg-[#D3F9D8] px-2 py-0.5 text-[11px] font-bold text-green-800">
            <span className="inline-block size-1.5 animate-pulse rounded-full bg-green-500" />
            LIVE
          </span>
        </div>
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="text-[10px] text-gray-400">
              {lastUpdated.toLocaleTimeString("ko-KR")}
            </span>
          )}
          <div className="relative">
            {viewMode === "list" && (
              <div className="absolute top-full right-0 z-10 mt-2 animate-bounce whitespace-nowrap rounded-lg border-2 border-neo-border bg-[#FFE66D] px-2.5 py-1 text-[10px] font-bold shadow-neo-xs">
                <div className="absolute -top-1 right-3 size-2 rotate-45 border-l-2 border-t-2 border-neo-border bg-[#FFE66D]" />
                지도로 봐보세요!
              </div>
            )}
            <div className="border-neo-border flex overflow-hidden rounded-lg border-2">
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 transition-all ${
                  viewMode === "list"
                    ? "bg-[#339AF0] text-white"
                    : "bg-white hover:bg-[#E8F4FD]"
                }`}
              >
                <List className="size-3.5" />
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`border-neo-border border-l-2 p-1.5 transition-all ${
                  viewMode === "map"
                    ? "bg-[#339AF0] text-white"
                    : "bg-white hover:bg-[#E8F4FD]"
                }`}
              >
                <Map className="size-3.5" />
              </button>
            </div>
          </div>
          <button
            onClick={() => refetch()}
            className="border-neo-border shadow-neo-xs hover:shadow-neo-sm rounded-lg border-2 bg-white p-1.5 transition-all active:translate-y-0.5 active:shadow-none"
          >
            <RefreshCw
              className={`size-3.5 ${isFetching ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Location Selector */}
      <div className="border-neo-border flex items-center gap-1.5 border-b-3 bg-[#F8F9FA] px-4 py-2">
        <MapPin className="size-3.5 text-gray-500" />
        {LOCATIONS.map((loc, i) => (
          <button
            key={loc.label}
            onClick={() => setLocationIdx(i)}
            className={`border-neo-border rounded-lg border-2 px-2.5 py-1 text-[11px] font-bold transition-all ${
              locationIdx === i
                ? "shadow-neo-xs bg-[#339AF0] text-white"
                : "bg-white hover:bg-[#E8F4FD]"
            }`}
          >
            {loc.label}
          </button>
        ))}
      </div>

      {/* Stats Bar */}
      <div className="border-neo-border grid grid-cols-3 gap-2 border-b-3 bg-white px-4 py-2">
        <div className="border-neo-border rounded-lg border-2 bg-[#E8F4FD] px-3 py-1.5 text-center">
          <div className="text-[9px] font-bold text-gray-400">전체</div>
          <div className="font-neo-heading text-lg font-bold text-[#339AF0]">
            {total}
          </div>
        </div>
        <div className="border-neo-border rounded-lg border-2 bg-[#D3F9D8] px-3 py-1.5 text-center">
          <div className="text-[9px] font-bold text-gray-400">비행 중</div>
          <div className="font-neo-heading text-lg font-bold text-green-700">
            {airborne}
          </div>
        </div>
        <div className="border-neo-border rounded-lg border-2 bg-[#FFE3E3] px-3 py-1.5 text-center">
          <div className="text-[9px] font-bold text-gray-400">지상</div>
          <div className="font-neo-heading text-lg font-bold text-[#FF6B6B]">
            {onGround}
          </div>
        </div>
      </div>

      {/* Content Area */}
      {viewMode === "map" ? (
        <div className="relative flex-1">
          {error && (
            <div className="border-neo-border shadow-neo-sm absolute left-3 right-3 top-3 z-1000 rounded-xl border-3 bg-[#FFE3E3] px-4 py-3 text-center text-[12px] font-bold text-red-800">
              {error.message}
            </div>
          )}
          <Suspense
            fallback={
              <div className="flex h-full flex-col items-center justify-center text-gray-400">
                <Plane className="mb-2 size-8 animate-bounce" />
                <span className="text-sm font-bold">지도 로딩 중...</span>
              </div>
            }
          >
            <FlightRadarMap
              aircraft={aircraft}
              center={{ lat: LOCATIONS[locationIdx].lat, lon: LOCATIONS[locationIdx].lon }}
              onSelectAircraft={setSelectedAc}
            />
          </Suspense>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-3">
          {error && (
            <div className="border-neo-border shadow-neo-sm mb-3 rounded-xl border-3 bg-[#FFE3E3] px-4 py-3 text-center text-[12px] font-bold text-red-800">
              {error.message}
            </div>
          )}
          {isLoading && aircraft.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Plane className="mb-2 size-8 animate-bounce" />
              <span className="text-sm font-bold">항공기 탐색 중...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {aircraft.map((ac) => (
                <AircraftCard
                  key={ac.hex}
                  ac={ac}
                  onClick={() => setSelectedAc(ac)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function FlightRadarContent() {
  return (
    <QueryProvider>
      <FlightRadarInner />
    </QueryProvider>
  );
}
