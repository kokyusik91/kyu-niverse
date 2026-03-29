"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Earthquake } from "./earthquake-types";

interface EarthquakeMapProps {
  quakes: Earthquake[];
}

function getMagColor(mag: number) {
  if (mag >= 6) return "#c0392b";
  if (mag >= 5) return "#FF6B6B";
  if (mag >= 4) return "#FF922B";
  if (mag >= 3) return "#FFE66D";
  if (mag >= 2) return "#4ECDC4";
  return "#868E96";
}

function getMagRadius(mag: number) {
  if (mag >= 7) return 20;
  if (mag >= 6) return 16;
  if (mag >= 5) return 13;
  if (mag >= 4) return 10;
  if (mag >= 3) return 7;
  return 5;
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function FitBounds({ quakes }: { quakes: Earthquake[] }) {
  const map = useMap();
  const fitted = useRef(false);

  useEffect(() => {
    if (fitted.current || quakes.length === 0) return;
    const bounds = quakes.map((q) => [q.lat, q.lon] as [number, number]);
    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 5 });
      fitted.current = true;
    }
  }, [quakes, map]);

  // 윈도우 리사이즈 시 회색 영역 방지
  useEffect(() => {
    const container = map.getContainer();
    const observer = new ResizeObserver(() => {
      map.invalidateSize();
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [map]);

  return null;
}

export default function EarthquakeMap({ quakes }: EarthquakeMapProps) {
  return (
    <div className="relative h-full w-full">
      <style>{`
        .quake-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          border: 2px solid #1A1A2E;
          box-shadow: 3px 3px 0 #1A1A2E;
          padding: 0;
        }
        .quake-popup .leaflet-popup-content { margin: 10px 12px; }
        .quake-popup .leaflet-popup-tip { border-top-color: #1A1A2E; }
        @keyframes quakePulse {
          0% { opacity: 1; r: inherit; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
      <MapContainer
        center={[30, 130]}
        zoom={3}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
        />
        <FitBounds quakes={quakes} />
        {quakes.map((quake) => (
          <CircleMarker
            key={quake.id}
            center={[quake.lat, quake.lon]}
            radius={getMagRadius(quake.mag)}
            pathOptions={{
              color: "#1A1A2E",
              weight: 2,
              fillColor: getMagColor(quake.mag),
              fillOpacity: quake.isNew ? 0.9 : 0.7,
            }}
          >
            <Popup className="quake-popup" closeButton={false}>
              <div style={{ minWidth: 160, fontFamily: "inherit" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: getMagColor(quake.mag),
                      color: quake.mag >= 4 ? "#fff" : "#1A1A2E",
                      fontWeight: 700,
                      fontSize: 14,
                      border: "2px solid #1A1A2E",
                    }}
                  >
                    {quake.mag.toFixed(1)}
                  </span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 12, lineHeight: 1.2 }}>
                      {quake.region}
                    </div>
                    <div style={{ fontSize: 10, color: "#888", marginTop: 2 }}>
                      {formatTime(quake.time)}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: 10, display: "flex", gap: 8, color: "#666" }}>
                  <span>깊이: {quake.depth.toFixed(1)}km</span>
                  <span>{quake.magtype}</span>
                </div>
                {quake.isNew && (
                  <div
                    style={{
                      marginTop: 4,
                      padding: "2px 6px",
                      fontSize: 9,
                      fontWeight: 700,
                      background: "#FF6B6B",
                      color: "#fff",
                      borderRadius: 4,
                      border: "1px solid #1A1A2E",
                      display: "inline-block",
                    }}
                  >
                    WS LIVE
                  </div>
                )}
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* Legend */}
      <div
        className="absolute bottom-3 left-3 z-1000 border-neo-border rounded-xl border-3 bg-white/95 px-3 py-2 backdrop-blur-sm"
      >
        <div className="mb-1 text-[9px] font-bold text-gray-400">진도</div>
        <div className="flex items-center gap-2">
          {[
            { mag: 2, label: "2" },
            { mag: 3, label: "3" },
            { mag: 4, label: "4" },
            { mag: 5, label: "5" },
            { mag: 6, label: "6+" },
          ].map(({ mag, label }) => (
            <div key={mag} className="flex items-center gap-1">
              <span
                className="inline-block rounded-full border border-[#1A1A2E]"
                style={{
                  width: getMagRadius(mag) * 1.2,
                  height: getMagRadius(mag) * 1.2,
                  background: getMagColor(mag),
                }}
              />
              <span className="text-[9px] font-bold">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
