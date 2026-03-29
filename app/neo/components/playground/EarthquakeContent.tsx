"use client";

import { useState, useEffect, useRef, useCallback, lazy, Suspense } from "react";
import { Activity, Wifi, WifiOff, List, Map } from "lucide-react";
import type { Earthquake } from "./earthquake-types";

const EarthquakeMap = lazy(() => import("./EarthquakeMap"));

const REST_URL =
  "https://www.seismicportal.eu/fdsnws/event/1/query?limit=20&format=json";
const WS_URL = "wss://www.seismicportal.eu/standing_order/websocket";
const MAX_QUAKES = 100;

function getMagColor(mag: number) {
  if (mag >= 6) return { bg: "bg-[#FF6B6B]", text: "text-white", border: "border-[#c0392b]" };
  if (mag >= 5) return { bg: "bg-[#FF922B]", text: "text-white", border: "border-[#d35400]" };
  if (mag >= 4) return { bg: "bg-[#FFE66D]", text: "text-neo-text", border: "border-[#f39c12]" };
  if (mag >= 3) return { bg: "bg-[#D3F9D8]", text: "text-green-800", border: "border-[#27ae60]" };
  return { bg: "bg-[#F8F9FA]", text: "text-gray-600", border: "border-gray-300" };
}

function getMagLabel(mag: number) {
  if (mag >= 7) return "대규모";
  if (mag >= 6) return "강진";
  if (mag >= 5) return "중규모";
  if (mag >= 4) return "중약진";
  if (mag >= 3) return "약진";
  if (mag >= 2) return "미약";
  return "미세";
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "방금 전";
  if (diffMin < 60) return `${diffMin}분 전`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}시간 전`;
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay}일 전`;
}

function formatFullTime(dateStr: string) {
  return new Date(dateStr).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function parseRestQuake(feature: {
  id: string;
  properties: Record<string, unknown>;
}): Earthquake {
  const p = feature.properties;
  return {
    id: feature.id,
    mag: p.mag as number,
    magtype: (p.magtype as string) || "M",
    region: (p.flynn_region as string) || "Unknown",
    lat: p.lat as number,
    lon: p.lon as number,
    depth: p.depth as number,
    time: p.time as string,
  };
}

function parseWsQuake(data: {
  data: {
    id?: string;
    properties: Record<string, unknown>;
    geometry?: { coordinates: number[] };
  };
}): Earthquake {
  const p = data.data.properties;
  const coords = data.data.geometry?.coordinates;
  return {
    id: data.data.id || `ws-${Date.now()}`,
    mag: p.mag as number,
    magtype: (p.magtype as string) || "M",
    region: (p.flynn_region as string) || "Unknown",
    lat: (p.lat as number) ?? coords?.[1] ?? 0,
    lon: (p.lon as number) ?? coords?.[0] ?? 0,
    depth: (p.depth as number) ?? (coords?.[2] ? Math.abs(coords[2]) : 0),
    time: p.time as string,
    isNew: true,
  };
}

interface Alert {
  id: string;
  quake: Earthquake;
  action: "create" | "update";
}

function useEarthquake() {
  const [quakes, setQuakes] = useState<Earthquake[]>([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const alertTimersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  const dismissAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  useEffect(() => {
    fetch(REST_URL)
      .then((res) => res.json())
      .then((data) => {
        const parsed = (data.features || []).map(parseRestQuake);
        setQuakes(parsed);
      })
      .catch(() => { /* network error on initial load */ })
      .finally(() => setLoading(false));
  }, []);

  const connect = useCallback(() => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => {
      setConnected(false);
      reconnectRef.current = setTimeout(connect, 5000);
    };
    ws.onerror = () => ws.close();

    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.action === "create" || msg.action === "update") {
          const quake = parseWsQuake(msg);
          setQuakes((prev) => {
            const filtered = prev.filter((q) => q.id !== quake.id);
            return [quake, ...filtered].slice(0, MAX_QUAKES);
          });

          const alertId = `${quake.id}-${Date.now()}`;
          setAlerts((prev) => [
            { id: alertId, quake, action: msg.action },
            ...prev,
          ].slice(0, 5));

          const timer = setTimeout(() => {
            setAlerts((prev) => prev.filter((a) => a.id !== alertId));
            alertTimersRef.current.delete(timer);
          }, 8000);
          alertTimersRef.current.add(timer);
        }
      } catch { /* malformed WS message */ }
    };

    return ws;
  }, []);

  useEffect(() => {
    const ws = connect();
    const timers = alertTimersRef.current;
    return () => {
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
      ws.close();
    };
  }, [connect]);

  return { quakes, connected, loading, alerts, dismissAlert };
}

function QuakeCard({ quake }: { quake: Earthquake }) {
  const color = getMagColor(quake.mag);
  const label = getMagLabel(quake.mag);

  return (
    <div
      className={`border-neo-border shadow-neo-xs rounded-xl border-3 bg-white p-3 transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#1A1A2E] ${
        quake.isNew ? "animate-[shake_0.5s_ease-in-out]" : ""
      }`}
    >
      <div className="flex gap-3">
        {/* Magnitude Badge */}
        <div
          className={`${color.bg} ${color.text} border-neo-border flex size-14 shrink-0 flex-col items-center justify-center rounded-xl border-3`}
        >
          <span className="font-neo-heading text-lg font-bold leading-tight">
            {quake.mag.toFixed(1)}
          </span>
          <span className="text-[8px] font-bold uppercase opacity-80">
            {quake.magtype}
          </span>
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-1.5">
            <span
              className={`${color.bg} ${color.text} border-neo-border rounded-md border-2 px-1.5 py-0.5 text-[9px] font-bold`}
            >
              {label}
            </span>
            {quake.isNew && (
              <span className="border-neo-border rounded-md border-2 bg-[#FF6B6B] px-1.5 py-0.5 text-[9px] font-bold text-white animate-pulse">
                NEW
              </span>
            )}
          </div>
          <p className="font-neo-heading text-neo-text truncate text-[13px] font-bold">
            {quake.region}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-gray-500">
            <span title={formatFullTime(quake.time)}>{formatTime(quake.time)}</span>
            <span>·</span>
            <span>깊이 {quake.depth.toFixed(1)}km</span>
            <span>·</span>
            <span>
              {quake.lat.toFixed(2)}°, {quake.lon.toFixed(2)}°
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AlertBanner({
  alert,
  onDismiss,
}: {
  alert: Alert;
  onDismiss: () => void;
}) {
  const { quake, action } = alert;
  const color = getMagColor(quake.mag);
  const isUpdate = action === "update";

  return (
    <div
      className={`border-neo-border shadow-neo-sm animate-[slideDown_0.3s_ease-out] flex items-center gap-3 rounded-xl border-3 ${color.bg} px-4 py-2.5`}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="border-neo-border flex size-8 shrink-0 items-center justify-center rounded-lg border-2 bg-white text-sm">
          {isUpdate ? "🔄" : "🚨"}
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className={`font-neo-heading text-[12px] font-bold ${color.text}`}>
              {isUpdate ? "진도 업데이트" : "새 지진 감지"}
            </span>
            <span className="border-neo-border rounded-md border-2 bg-white/80 px-1.5 py-0.5 text-[10px] font-bold">
              WS
            </span>
          </div>
          <p className={`truncate text-[11px] font-semibold ${color.text} opacity-90`}>
            M{quake.mag.toFixed(1)} — {quake.region}
          </p>
        </div>
      </div>
      <button
        onClick={onDismiss}
        className={`shrink-0 text-[11px] font-bold ${color.text} opacity-60 hover:opacity-100`}
      >
        ✕
      </button>
    </div>
  );
}

type ViewMode = "list" | "map";

export default function EarthquakeContent() {
  const { quakes, connected, loading, alerts, dismissAlert } = useEarthquake();
  const [minMag, setMinMag] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const filtered = quakes.filter((q) => q.mag >= minMag);
  const stats = {
    total: quakes.length,
    significant: quakes.filter((q) => q.mag >= 4).length,
    max: quakes.length > 0 ? Math.max(...quakes.map((q) => q.mag)) : 0,
  };

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="border-neo-border flex items-center justify-between border-b-3 bg-[#FFF3E0] px-4 py-3">
        <div className="flex items-center gap-2">
          <Activity className="size-5 text-[#FF922B]" />
          <span className="font-neo-heading text-sm font-bold">
            Earthquake Monitor
          </span>
          <span
            className={`border-neo-border inline-flex items-center gap-1 rounded-full border-2 px-2 py-0.5 text-[11px] font-bold ${
              connected
                ? "bg-[#D3F9D8] text-green-800"
                : "bg-[#FFE3E3] text-red-800"
            }`}
          >
            {connected ? (
              <Wifi className="size-3" />
            ) : (
              <WifiOff className="size-3" />
            )}
            {connected ? "LIVE" : "연결 중..."}
          </span>
        </div>
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
                  ? "bg-[#FF922B] text-white"
                  : "bg-white hover:bg-[#FFF3E0]"
              }`}
            >
              <List className="size-3.5" />
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`border-neo-border border-l-2 p-1.5 transition-all ${
                viewMode === "map"
                  ? "bg-[#FF922B] text-white"
                  : "bg-white hover:bg-[#FFF3E0]"
              }`}
            >
              <Map className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="border-neo-border grid grid-cols-3 gap-2 border-b-3 bg-white px-4 py-2">
        <div className="border-neo-border rounded-lg border-2 bg-[#FFF3E0] px-3 py-1.5 text-center">
          <div className="text-[9px] font-bold text-gray-400">수신</div>
          <div className="font-neo-heading text-lg font-bold text-[#FF922B]">
            {stats.total}
          </div>
        </div>
        <div className="border-neo-border rounded-lg border-2 bg-[#FFE3E3] px-3 py-1.5 text-center">
          <div className="text-[9px] font-bold text-gray-400">M4.0+</div>
          <div className="font-neo-heading text-lg font-bold text-[#FF6B6B]">
            {stats.significant}
          </div>
        </div>
        <div className="border-neo-border rounded-lg border-2 bg-[#F8F9FA] px-3 py-1.5 text-center">
          <div className="text-[9px] font-bold text-gray-400">최대 진도</div>
          <div className="font-neo-heading text-lg font-bold text-neo-text">
            {stats.max > 0 ? stats.max.toFixed(1) : "-"}
          </div>
        </div>
      </div>

      {/* Magnitude Filter */}
      <div className="border-neo-border flex items-center gap-1.5 border-b-3 bg-[#F8F9FA] px-4 py-2">
        <span className="text-[11px] font-bold text-gray-500">최소 진도</span>
        {[0, 2, 3, 4, 5].map((m) => (
          <button
            key={m}
            onClick={() => setMinMag(m)}
            className={`border-neo-border rounded-lg border-2 px-2.5 py-1 text-[11px] font-bold transition-all ${
              minMag === m
                ? "shadow-neo-xs bg-[#FF922B] text-white"
                : "bg-white hover:bg-[#FFF3E0]"
            }`}
          >
            {m === 0 ? "전체" : `M${m}+`}
          </button>
        ))}
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="border-neo-border space-y-1.5 border-b-3 bg-[#FFF8E1] px-3 py-2">
          {alerts.map((alert) => (
            <AlertBanner
              key={alert.id}
              alert={alert}
              onDismiss={() => dismissAlert(alert.id)}
            />
          ))}
        </div>
      )}

      {/* Content */}
      {viewMode === "map" ? (
        <div className="relative flex-1">
          <Suspense
            fallback={
              <div className="flex h-full flex-col items-center justify-center text-gray-400">
                <Activity className="mb-2 size-8 animate-pulse" />
                <span className="text-sm font-bold">지도 로딩 중...</span>
              </div>
            }
          >
            <EarthquakeMap quakes={filtered} />
          </Suspense>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Activity className="mb-2 size-8 animate-pulse" />
              <span className="text-sm font-bold">지진 데이터 로딩 중...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <span className="mb-2 text-3xl">🌍</span>
              <span className="text-sm font-bold">
                {minMag > 0
                  ? `M${minMag}+ 지진이 없습니다`
                  : "지구가 조용합니다..."}
              </span>
              <span className="mt-1 text-[11px]">
                지진 발생 시 실시간으로 표시됩니다
              </span>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((quake) => (
                <QuakeCard key={quake.id} quake={quake} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* shake animation */}
      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
