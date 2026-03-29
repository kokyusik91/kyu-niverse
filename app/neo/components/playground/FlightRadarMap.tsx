"use client";

import { useEffect, useRef, useMemo, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  type Aircraft,
  getAirline,
  getFlightLabel,
  formatAltitude,
} from "./flight-radar-utils";

interface FlightRadarMapProps {
  aircraft: Aircraft[];
  center: { lat: number; lon: number };
  onSelectAircraft: (ac: Aircraft) => void;
}

// lucide Plane SVG points upper-right (~315°), -45° aligns nose to north (0°)
const LUCIDE_ROTATION_OFFSET = -45;

function createAircraftIcon(track: number, isGround: boolean, isEmergency: boolean) {
  const color = isEmergency ? "#FF6B6B" : isGround ? "#868E96" : "#339AF0";
  const rotation = (track || 0) + LUCIDE_ROTATION_OFFSET;

  return L.divIcon({
    className: "aircraft-marker",
    html: `<div style="transform: rotate(${rotation}deg); display: flex; align-items: center; justify-content: center; filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.3));">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="${color}" stroke="#1A1A2E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
      </svg>
    </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
}

const MAP_STYLES = `
  .aircraft-marker { background: none !important; border: none !important; }
  .aircraft-popup .leaflet-popup-content-wrapper {
    border-radius: 12px;
    border: 2px solid #1A1A2E;
    box-shadow: 3px 3px 0 #1A1A2E;
    padding: 0;
  }
  .aircraft-popup .leaflet-popup-content { margin: 10px 12px; }
  .aircraft-popup .leaflet-popup-tip { border-top-color: #1A1A2E; }
`;

function MapRecenter({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  const prevCenter = useRef({ lat, lon });

  useEffect(() => {
    if (prevCenter.current.lat !== lat || prevCenter.current.lon !== lon) {
      map.flyTo([lat, lon], map.getZoom(), { duration: 1 });
      prevCenter.current = { lat, lon };
    }
  }, [lat, lon, map]);

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

function InterpolatedMarker({
  ac,
  onSelect,
}: {
  ac: Aircraft;
  onSelect: () => void;
}) {
  const markerRef = useRef<L.Marker>(null);
  const posRef = useRef({ lat: ac.lat!, lon: ac.lon! });
  const anchorRef = useRef({ lat: ac.lat!, lon: ac.lon!, time: performance.now() });
  const animFrameRef = useRef<number>(0);

  const isEmergency = ac.emergency !== undefined && ac.emergency !== "none";
  const isGround = ac.alt_baro === "ground";

  const icon = useMemo(
    () => createAircraftIcon(ac.track || 0, isGround, isEmergency),
    [ac.track, isGround, isEmergency],
  );

  // Reset anchor when new server data arrives
  useEffect(() => {
    if (ac.lat && ac.lon) {
      anchorRef.current = { lat: ac.lat, lon: ac.lon, time: performance.now() };
    }
  }, [ac.lat, ac.lon]);

  // Interpolation loop: predict from anchor, not from previous prediction
  useEffect(() => {
    const LERP_SPEED = 0.03;

    function animate() {
      const now = performance.now();
      const anchor = anchorRef.current;
      const elapsed = (now - anchor.time) / 1000;

      let targetLat = anchor.lat;
      let targetLon = anchor.lon;

      if (ac.gs && ac.track !== undefined && ac.gs > 0 && elapsed < 30) {
        const speedDegPerSec = (ac.gs * 0.00027778) / 60;
        const rad = (ac.track * Math.PI) / 180;
        targetLat = anchor.lat + Math.cos(rad) * speedDegPerSec * elapsed;
        targetLon = anchor.lon + Math.sin(rad) * speedDegPerSec * elapsed;
      }

      const cur = posRef.current;
      cur.lat += (targetLat - cur.lat) * LERP_SPEED;
      cur.lon += (targetLon - cur.lon) * LERP_SPEED;

      const marker = markerRef.current;
      if (marker) {
        marker.setLatLng([cur.lat, cur.lon]);
      }

      animFrameRef.current = requestAnimationFrame(animate);
    }

    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [ac.gs, ac.track]);

  const label = getFlightLabel(ac);
  const airline = getAirline(ac);

  return (
    <Marker
      ref={markerRef}
      position={[posRef.current.lat, posRef.current.lon]}
      icon={icon}
    >
      <Popup className="aircraft-popup" closeButton={false} autoPan={false}>
        <div style={{ minWidth: 140, fontFamily: "inherit" }}>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{label}</div>
          {airline && <div style={{ fontSize: 11, color: "#555", marginBottom: 4 }}>{airline}</div>}
          <div style={{ fontSize: 11, display: "flex", gap: 8 }}>
            <span>고도: {formatAltitude(ac.alt_baro)}</span>
            <span>속도: {ac.gs ? `${Math.round(ac.gs)}kts` : "-"}</span>
          </div>
          {ac.t && <div style={{ fontSize: 10, color: "#339AF0", marginTop: 2 }}>{ac.t}</div>}
          <button
            onClick={onSelect}
            style={{
              marginTop: 6,
              padding: "3px 8px",
              fontSize: 10,
              fontWeight: 700,
              background: "#339AF0",
              color: "#fff",
              border: "2px solid #1A1A2E",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            상세 보기
          </button>
        </div>
      </Popup>
    </Marker>
  );
}

export default function FlightRadarMap({
  aircraft,
  center,
  onSelectAircraft,
}: FlightRadarMapProps) {
  const handleSelect = useCallback(
    (ac: Aircraft) => () => onSelectAircraft(ac),
    [onSelectAircraft],
  );

  return (
    <div className="relative h-full w-full">
      <style>{MAP_STYLES}</style>
      <MapContainer
        center={[center.lat, center.lon]}
        zoom={10}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
        />
        <MapRecenter lat={center.lat} lon={center.lon} />
        {aircraft.map((ac) => (
          <InterpolatedMarker
            key={ac.hex}
            ac={ac}
            onSelect={handleSelect(ac)}
          />
        ))}
      </MapContainer>
    </div>
  );
}
