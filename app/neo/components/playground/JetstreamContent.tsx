"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Waves, Pause, Play, Trash2 } from "lucide-react";

interface JetstreamPost {
  id: string;
  did: string;
  handle: string;
  text: string;
  createdAt: string;
  langs?: string[];
}

const WS_URL =
  "wss://jetstream2.us-east.bsky.network/subscribe?wantedCollections=app.bsky.feed.post";
const MAX_POSTS = 150;

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function getLangLabel(langs?: string[]) {
  if (!langs?.length) return null;
  const map: Record<string, string> = {
    ko: "🇰🇷",
    ja: "🇯🇵",
    en: "🇺🇸",
    zh: "🇨🇳",
    es: "🇪🇸",
    fr: "🇫🇷",
    de: "🇩🇪",
    pt: "🇧🇷",
  };
  return langs.map((l) => map[l] || l).join(" ");
}

const LANG_FILTERS = [
  { code: null, label: "전체" },
  { code: "ko", label: "🇰🇷 한국어" },
  { code: "ja", label: "🇯🇵 日本語" },
  { code: "en", label: "🇺🇸 English" },
] as const;

function useJetstream() {
  const [posts, setPosts] = useState<JetstreamPost[]>([]);
  const [connected, setConnected] = useState(false);
  const [paused, setPaused] = useState(false);
  const [count, setCount] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);
  const pausedRef = useRef(paused);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const connect = useCallback(() => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => {
      setConnected(false);
      reconnectRef.current = setTimeout(connect, 3000);
    };

    ws.onmessage = (e) => {
      if (pausedRef.current) return;

      try {
        const data = JSON.parse(e.data);
        if (data.kind !== "commit" || data.commit?.operation !== "create") return;
        if (data.commit?.collection !== "app.bsky.feed.post") return;

        const record = data.commit.record;
        if (!record?.text) return;

        const post: JetstreamPost = {
          id: `${data.did}-${Date.now()}-${Math.random()}`,
          did: data.did,
          handle: data.did.replace("did:plc:", "").slice(0, 8),
          text: record.text,
          createdAt: record.createdAt || new Date().toISOString(),
          langs: record.langs,
        };

        setPosts((prev) => [post, ...prev].slice(0, MAX_POSTS));
        setCount((c) => c + 1);
      } catch { /* malformed WS message */ }
    };

    return ws;
  }, []);

  useEffect(() => {
    const ws = connect();
    return () => {
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      ws.close();
    };
  }, [connect]);

  const clear = useCallback(() => {
    setPosts([]);
    setCount(0);
  }, []);

  return { posts, connected, paused, setPaused, count, clear };
}

export default function JetstreamContent() {
  const { posts, connected, paused, setPaused, count, clear } = useJetstream();
  const [langFilter, setLangFilter] = useState<string | null>(null);

  const filteredPosts = langFilter
    ? posts.filter((p) => p.langs?.includes(langFilter))
    : posts;

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="border-neo-border flex items-center justify-between border-b-3 bg-[#E8FFF8] px-4 py-3">
        <div className="flex items-center gap-2">
          <Waves className="size-5 text-[#4ECDC4]" />
          <span className="font-neo-heading text-sm font-bold">
            Bluesky Jetstream
          </span>
          <span
            className={`border-neo-border inline-flex items-center gap-1 rounded-full border-2 px-2 py-0.5 text-[11px] font-bold ${
              connected
                ? "bg-[#D3F9D8] text-green-800"
                : "bg-[#FFE3E3] text-red-800"
            }`}
          >
            <span
              className={`inline-block size-1.5 rounded-full ${
                connected ? "bg-green-500" : "bg-red-500"
              }`}
            />
            {connected ? "LIVE" : "연결 중..."}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="border-neo-border rounded-lg border-2 bg-white px-2 py-0.5 text-[11px] font-bold">
            {count.toLocaleString()}건
          </span>
          <button
            onClick={() => setPaused(!paused)}
            className="border-neo-border shadow-neo-xs hover:shadow-neo-sm rounded-lg border-2 bg-white p-1.5 transition-all active:translate-y-0.5 active:shadow-none"
          >
            {paused ? (
              <Play className="size-3.5" />
            ) : (
              <Pause className="size-3.5" />
            )}
          </button>
          <button
            onClick={clear}
            className="border-neo-border shadow-neo-xs hover:shadow-neo-sm rounded-lg border-2 bg-white p-1.5 transition-all active:translate-y-0.5 active:shadow-none"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Language Filter */}
      <div className="border-neo-border flex gap-1.5 border-b-3 bg-[#F8F9FA] px-4 py-2">
        {LANG_FILTERS.map((f) => (
          <button
            key={f.code ?? "all"}
            onClick={() => setLangFilter(f.code)}
            className={`border-neo-border rounded-lg border-2 px-2.5 py-1 text-[11px] font-bold transition-all ${
              langFilter === f.code
                ? "shadow-neo-xs bg-[#4ECDC4] text-white"
                : "bg-white hover:bg-[#E8FFF8]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Posts Feed */}
      <div className="flex-1 overflow-y-auto p-3">
        {paused && (
          <div className="border-neo-border shadow-neo-sm mb-3 rounded-xl border-3 bg-[#FFE66D] px-4 py-2 text-center text-[12px] font-bold">
            ⏸️ 일시정지 중 — 새 포스트가 쌓이지 않습니다
          </div>
        )}
        <div className="space-y-2">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="border-neo-border shadow-neo-xs rounded-xl border-3 bg-white p-3 transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#1A1A2E]"
            >
              <div className="mb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="border-neo-border inline-flex size-6 items-center justify-center rounded-full border-2 bg-[#E8FFF8] text-[10px] font-bold">
                    🦋
                  </span>
                  <span className="font-neo-heading text-[12px] font-bold text-[#4ECDC4]">
                    {post.handle}...
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {post.langs && (
                    <span className="text-[11px]">
                      {getLangLabel(post.langs)}
                    </span>
                  )}
                  <span className="text-[10px] text-gray-400">
                    {formatTime(post.createdAt)}
                  </span>
                </div>
              </div>
              <p className="text-neo-text text-[13px] leading-relaxed break-words">
                {post.text}
              </p>
            </div>
          ))}
        </div>
        {filteredPosts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Waves className="mb-2 size-8" />
            <span className="text-sm font-bold">
              {connected ? "포스트 대기 중..." : "연결 중..."}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
