"use client";

import { useEffect, useRef, useState } from "react";
import type { RelationshipGraphData } from "./types";

const RELATION_COLORS: Record<string, string> = {
  호감: "#FF6B6B",
  동료: "#38BDF8",
  적대: "#EF4444",
  가족: "#A78BFA",
  라이벌: "#FB923C",
  상사: "#6366F1",
  부하: "#14B8A6",
};

interface RelationshipGraphProps {
  data: RelationshipGraphData;
}

export default function RelationshipGraph({ data }: RelationshipGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<unknown>(null);
  const [selectedArcId, setSelectedArcId] = useState<number | null>(null);

  const filteredEdges = selectedArcId
    ? data.edges.filter(
        (e) => e.arcId === null || e.arcId <= selectedArcId,
      )
    : data.edges;

  const connectedNodeIds = new Set<number>();
  for (const edge of filteredEdges) {
    connectedNodeIds.add(edge.from);
    connectedNodeIds.add(edge.to);
  }
  const filteredNodes = selectedArcId
    ? data.nodes.filter((n) => connectedNodeIds.has(n.id))
    : data.nodes;

  useEffect(() => {
    if (!containerRef.current || filteredNodes.length === 0) return;

    let destroyed = false;

    import("vis-network/standalone").then(({ Network }) => {
      if (destroyed || !containerRef.current) return;

      const nodes = filteredNodes.map((n) => ({
        id: n.id,
        label: n.label,
        image: n.image ?? undefined,
        shape: n.image ? "circularImage" : "ellipse",
        group: n.group,
        title: n.title,
        font: { size: 12, face: "Plus Jakarta Sans", bold: { color: "#1a1a1a" } },
        borderWidth: 3,
        color: {
          border: "#1a1a1a",
          background: "#FFFFFF",
        },
        size: 30,
      }));

      const edges = filteredEdges.map((e) => ({
        id: e.id,
        from: e.from,
        to: e.to,
        label: e.label,
        arrows: e.arrows,
        title: e.title,
        font: { size: 10, face: "Inter", align: "middle" },
        color: {
          color: RELATION_COLORS[e.label] ?? "#999999",
          highlight: "#1a1a1a",
        },
        width: 2,
        smooth: { enabled: true, type: "curvedCW", roundness: 0.2 },
      }));

      const network = new Network(
        containerRef.current,
        { nodes, edges },
        {
          physics: {
            solver: "forceAtlas2Based",
            forceAtlas2Based: {
              gravitationalConstant: -40,
              centralGravity: 0.005,
              springLength: 150,
              springConstant: 0.08,
            },
            stabilization: { iterations: 100 },
          },
          interaction: {
            hover: true,
            zoomView: true,
            dragView: true,
            zoomSpeed: 0.5,
            minZoom: 0.3,
            maxZoom: 2.0,
          },
          layout: { improvedLayout: true },
        },
      );

      networkRef.current = network;
    });

    return () => {
      destroyed = true;
      if (networkRef.current && typeof (networkRef.current as { destroy?: () => void }).destroy === "function") {
        (networkRef.current as { destroy: () => void }).destroy();
      }
    };
  }, [filteredNodes, filteredEdges]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div
          className="inline-block rounded-md bg-[#1a1a1a] px-3 py-1"
          style={{ transform: "rotate(1deg)" }}
        >
          <span className="font-neo-heading text-[10px] font-black tracking-[2px] text-[#FF6B6B]">
            RELATIONSHIP
          </span>
        </div>
      </div>

      {/* Arc selector */}
      {data.arcs.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedArcId(null)}
            className={`border-neo-border rounded-lg border-2 px-3 py-1 text-[10px] font-bold transition-all ${
              selectedArcId === null
                ? "bg-[#1a1a1a] text-white shadow-none"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            전체
          </button>
          {data.arcs.map((arc) => (
            <button
              key={arc.id}
              onClick={() => setSelectedArcId(arc.id)}
              className={`border-neo-border rounded-lg border-2 px-3 py-1 text-[10px] font-bold transition-all ${
                selectedArcId === arc.id
                  ? "bg-[#FACC15] shadow-[2px_2px_0_#1a1a1a]"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {arc.name}
              {arc.episodeRange ? ` (${arc.episodeRange})` : ""}
            </button>
          ))}
        </div>
      )}

      {/* Graph container */}
      <div
        ref={containerRef}
        className="border-neo-border h-[400px] rounded-xl border-3 bg-white shadow-[4px_4px_0_#1a1a1a]"
      />

      {/* Legend */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(RELATION_COLORS).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-[10px] font-semibold text-gray-500">
              {type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
