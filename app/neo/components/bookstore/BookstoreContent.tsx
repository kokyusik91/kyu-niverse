"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import BookScene from "./BookScene";

export interface BookData {
  id: string;
  coverUrl: string;
  title: string;
}

const BOOK_DESCRIPTIONS: Record<string, string> = {
  kludge: "인간의 비합리적 사고와 뇌의 결함을 다룬 심리학 도서. 왜 우리는 이상한 결정을 내리는지 과학적으로 풀어냅니다.",
  superrich: "부의 본질과 부자들의 사고방식을 분석합니다. 진정한 부란 무엇인지에 대한 새로운 시각을 제시합니다.",
  system: "복잡한 시스템의 작동 원리를 이해하고, 시스템적 사고로 문제를 해결하는 방법을 안내합니다.",
  logical: "맥킨지식 논리적 사고와 구성의 기술. 체계적인 사고 프레임워크를 제시합니다.",
  personal: "자기 자신을 브랜드로 만드는 퍼스널 브랜딩 전략. 나만의 고유한 가치를 발견하고 표현하는 법.",
  trend2023: "2023년 트렌드를 분석하고 미래를 예측합니다. 변화하는 시대를 읽는 눈을 길러줍니다.",
  wanna: "진짜 원하는 것을 찾고 실현하는 방법. 막연한 꿈을 구체적인 목표로 바꾸는 실천 가이드.",
  passinglane: "추월차선의 사고방식으로 부의 고속도로에 진입하는 전략을 제시합니다.",
  wellthinking: "좋은 생각이 좋은 인생을 만든다. 사고의 질을 높이는 실용적인 방법론.",
  reverage: "레버리지를 활용한 효율적인 성장 전략. 적은 노력으로 큰 결과를 만드는 원리.",
  trend2024: "2024년 소비 트렌드와 사회 변화를 예측하고 분석합니다.",
  mental: "멘탈 관리와 회복탄력성에 대한 실전 가이드. 흔들리지 않는 마음을 만드는 법.",
  economy: "경제의 기본 원리부터 투자까지, 경제적 사고력을 키우는 입문서.",
  reverser: "역발상의 힘. 남들과 다르게 생각하는 것이 어떻게 기회가 되는지를 보여줍니다.",
};

const BOOK_CATEGORIES: Record<string, string> = {
  kludge: "심리학",
  superrich: "경제",
  system: "사고법",
  logical: "사고법",
  personal: "자기계발",
  trend2023: "트렌드",
  wanna: "자기계발",
  passinglane: "경제",
  wellthinking: "사고법",
  reverage: "경제",
  trend2024: "트렌드",
  mental: "자기계발",
  economy: "경제",
  reverser: "사고법",
};

const CATEGORY_COLORS: Record<string, string> = {
  "심리학": "bg-neo-info text-white",
  "경제": "bg-neo-success text-neo-text",
  "사고법": "bg-neo-accent text-neo-text",
  "자기계발": "bg-neo-primary text-white",
  "트렌드": "bg-neo-secondary text-neo-text",
};

function lightenHexColor(hex: string, factor: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lr = Math.round(r + (255 - r) * factor);
  const lg = Math.round(g + (255 - g) * factor);
  const lb = Math.round(b + (255 - b) * factor);
  return `rgb(${lr}, ${lg}, ${lb})`;
}

export default function BookstoreContent({ books }: { books: BookData[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [bookColors, setBookColors] = useState<Record<string, string>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !selectedId) return;

    const blockWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-detail-panel]")) return;
      e.preventDefault();
      e.stopPropagation();
    };

    el.addEventListener("wheel", blockWheel, { passive: false });
    return () => el.removeEventListener("wheel", blockWheel);
  }, [selectedId]);

  const handleSelect = useCallback((id: string | null) => {
    setSelectedId(id);
  }, []);

  const handleColorExtracted = useCallback(
    (bookId: string, color: string) => {
      setBookColors((prev) => {
        if (prev[bookId] === color) return prev;
        return { ...prev, [bookId]: color };
      });
    },
    [],
  );

  const selectedBook = useMemo(
    () => books.find((b) => b.id === selectedId) ?? null,
    [books, selectedId],
  );

  const bgColor = selectedId
    ? lightenHexColor(bookColors[selectedId] || "#FAF5EE", 0.7)
    : "";

  if (books.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-neo-text font-neo">
        No book data
      </div>
    );
  }

  const category = selectedBook ? BOOK_CATEGORIES[selectedBook.title] ?? "기타" : "";
  const categoryStyle = CATEGORY_COLORS[category] ?? "bg-neo-bg text-neo-text";
  const description = selectedBook ? BOOK_DESCRIPTIONS[selectedBook.title] ?? "" : "";

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden transition-colors duration-300"
      style={{
        background: selectedId ? bgColor : "#FAF5EE",
      }}
    >
      {/* Dot pattern overlay */}
      {!selectedId && (
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: `radial-gradient(circle, #1A1A2E 1px, transparent 1px)`,
            backgroundSize: "16px 16px",
          }}
        />
      )}

      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <BookScene
          books={books}
          selectedId={selectedId}
          onSelect={handleSelect}
          onColorExtracted={handleColorExtracted}
        />
      </div>

      {/* Back button - neo brutalism style */}
      <button
        className="neo-btn absolute top-4 left-4 z-20 flex items-center gap-1.5 px-4 py-2 bg-neo-accent border-3 border-neo-border rounded-lg shadow-neo-sm font-neo font-bold text-neo-text text-sm cursor-pointer transition-all duration-200"
        style={{
          opacity: selectedId ? 1 : 0,
          pointerEvents: selectedId ? "auto" : "none",
          transform: selectedId ? "translateX(0)" : "translateX(-20px)",
        }}
        onClick={() => handleSelect(null)}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10 12L6 8L10 4" />
        </svg>
        뒤로가기
      </button>

      {/* Detail panel - neo brutalism card */}
      <div
        data-detail-panel
        className="absolute top-0 right-0 h-full z-10 transition-all duration-300 ease-out overflow-y-auto"
        style={{
          width: "42%",
          opacity: selectedBook ? 1 : 0,
          pointerEvents: selectedBook ? "auto" : "none",
          transform: selectedBook ? "translateX(0)" : "translateX(40px)",
        }}
      >
        {selectedBook && (
          <div className="flex flex-col justify-center min-h-full px-6 py-10">
            <div className="bg-neo-surface border-3 border-neo-border rounded-xl shadow-neo-lg p-6 space-y-5">
              {/* Category badge */}
              <span
                className={`inline-block px-3 py-1 text-xs font-bold font-neo border-2 border-neo-border rounded-md ${categoryStyle}`}
              >
                {category}
              </span>

              {/* Title */}
              <h2 className="text-2xl font-bold tracking-tight font-neo-heading text-neo-text leading-snug">
                {selectedBook.title}
              </h2>

              {/* Divider */}
              <div className="h-1 bg-neo-border rounded-full" />

              {/* Description */}
              {description && (
                <div className="border-3 border-neo-border rounded-lg bg-neo-bg p-4">
                  <p className="text-neo-text text-sm leading-relaxed font-neo">
                    {description}
                  </p>
                </div>
              )}

              {/* Drag hint */}
              <p className="text-xs text-neo-text/50 font-neo flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L12 22M2 12L22 12M7 7L17 17M17 7L7 17" />
                </svg>
                3D 모델을 드래그해서 돌려볼 수 있어요
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
