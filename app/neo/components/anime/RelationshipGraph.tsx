"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import type { RelationshipGraphData } from "./types";

const RELATION_COLORS: Record<string, string> = {
  호감: "#FF6B6B",
  동료: "#38BDF8",
  적대: "#EF4444",
  가족: "#A78BFA",
  라이벌: "#FB923C",
  상사: "#6366F1",
  부하: "#14B8A6",
  파트너: "#10B981",
  버디: "#06B6D4",
  사제: "#8B5CF6",
  추종: "#F59E0B",
  이용: "#64748B",
  동거인: "#EC4899",
};

interface VisNetwork {
  destroy: () => void;
  setData: (d: { nodes: unknown[]; edges: unknown[] }) => void;
  stabilize: (iterations: number) => void;
  fit: (options?: { animation: boolean }) => void;
  once: (event: string, callback: () => void) => void;
}

interface RelationshipGraphProps {
  data: RelationshipGraphData;
}

export default function RelationshipGraph({ data }: RelationshipGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<VisNetwork | null>(null);
  const [selectedArcId, setSelectedArcId] = useState<number | null>(null);

  const { visNodes, visEdges } = useMemo(() => {
    const filteredEdges = selectedArcId
      ? data.edges.filter((e) => e.arcId === null || e.arcId <= selectedArcId)
      : data.edges;

    const connectedNodeIds = new Set<number>();
    for (const edge of filteredEdges) {
      connectedNodeIds.add(edge.from);
      connectedNodeIds.add(edge.to);
    }

    const filteredNodes = selectedArcId
      ? data.nodes.filter((n) => connectedNodeIds.has(n.id))
      : data.nodes;

    return {
      visNodes: filteredNodes.map((n) => ({
        id: n.id,
        label: n.label,
        image: n.image ?? undefined,
        shape: n.image ? "circularImage" : "ellipse",
        group: n.group,
        title: n.title,
        font: { size: 12, face: "Plus Jakarta Sans" },
        borderWidth: 3,
        color: { border: "#1a1a1a", background: "#FFFFFF" },
        size: 30,
      })),
      visEdges: filteredEdges.map((e) => ({
        id: e.id,
        from: e.from,
        to: e.to,
        label: e.label,
        arrows: e.arrows,
        title: e.title,
        font: { size: 10, face: "Inter", align: "middle" as const },
        color: {
          color: RELATION_COLORS[e.label] ?? "#999999",
          highlight: "#1a1a1a",
        },
        width: 2,
        smooth: { enabled: true, type: "curvedCW" as const, roundness: 0.2 },
      })),
    };
  }, [data, selectedArcId]);

  const pendingDataRef = useRef<{ nodes: typeof visNodes; edges: typeof visEdges } | null>(null);

  // Network 인스턴스 생성 — 최초 1회만
  useEffect(() => {
    if (!containerRef.current) return;

    let destroyed = false;

    import("vis-network/standalone").then(({ Network }) => {
      if (destroyed || !containerRef.current) return;

      const network = new Network(
        containerRef.current,
        { nodes: [], edges: [] },
        {
          physics: {
            solver: "forceAtlas2Based",
            forceAtlas2Based: {
              gravitationalConstant: -50,
              centralGravity: 0.008,
              springLength: 160,
              springConstant: 0.06,
            },
            stabilization: { iterations: 150 },
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

      networkRef.current = network as unknown as VisNetwork;

      // 비동기 로딩 중 쌓인 데이터가 있으면 즉시 주입
      if (pendingDataRef.current) {
        const { nodes, edges } = pendingDataRef.current;
        pendingDataRef.current = null;
        network.setData({ nodes, edges });
        (network as unknown as VisNetwork).once("stabilizationIterationsDone", () => {
          (network as unknown as VisNetwork).fit({ animation: true });
        });
        (network as unknown as VisNetwork).stabilize(150);
      }
    });

    return () => {
      destroyed = true;
      networkRef.current?.destroy();
      networkRef.current = null;
    };
  }, []);

  // 데이터 변경 시 setData로 교체 (Network 재생성 없이)
  useEffect(() => {
    if (visNodes.length === 0) return;

    const network = networkRef.current;
    if (!network) {
      // Network 아직 로딩 중 — 나중에 주입하도록 보관
      pendingDataRef.current = { nodes: visNodes, edges: visEdges };
      return;
    }

    network.setData({ nodes: visNodes, edges: visEdges });

    // stabilization 완료 후 fit
    network.once("stabilizationIterationsDone", () => {
      network.fit({ animation: true });
    });
    network.stabilize(150);
  }, [visNodes, visEdges]);

  // 범례: 실제 사용된 관계 유형만
  const usedRelationTypes = useMemo(() => {
    const types = new Set(data.edges.map((e) => e.label));
    return Object.entries(RELATION_COLORS).filter(([type]) => types.has(type));
  }, [data.edges]);

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

      {/* Legend — 실제 사용된 관계만 */}
      {usedRelationTypes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {usedRelationTypes.map(([type, color]) => (
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
      )}
    </div>
  );
}
