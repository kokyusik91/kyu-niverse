"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { supabase, type PostItNote } from "@/lib/supabase";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { toast, Toaster } from "sonner";

function fireConfetti(x: number, y: number) {
  const origin = { x, y };
  const colors = ["#FF6B6B", "#4ECDC4", "#FFE66D", "#A8E6CF", "#DDA0DD", "#87CEEB", "#FF8B94", "#000"];

  confetti({ particleCount: 100, spread: 100, origin, colors, ticks: 80, gravity: 0.8, scalar: 1.1, startVelocity: 30 });
  setTimeout(() => confetti({ particleCount: 50, angle: 120, spread: 60, origin: { x: x - 0.05, y }, colors, ticks: 70, gravity: 1, scalar: 0.8, startVelocity: 25 }), 100);
  setTimeout(() => confetti({ particleCount: 50, angle: 60, spread: 60, origin: { x: x + 0.05, y }, colors, ticks: 70, gravity: 1, scalar: 0.8, startVelocity: 25 }), 200);
}

interface PostIt {
  id: string;
  x: number;
  y: number;
  content: string;
  color: string;
  rotation: number;
  avatar_url: string;
  created_at: string;
  isEditing: boolean;
  isNew: boolean;
}

const PALETTES = [
  "#FF6B6B", "#4ECDC4", "#FFE66D", "#A8E6CF",
  "#FF8B94", "#DDA0DD", "#87CEEB",
];

interface CharacterInfo {
  file: string;
  nameKr: string;
  nameJp: string;
  anime: string;
  species: string;
  desc: string;
}

const CHARACTERS: CharacterInfo[] = [
  { file: "1_Denji.jpg", nameKr: "덴지", nameJp: "デンジ", anime: "체인소 맨", species: "인간/악마", desc: "포치타와 합체한 체인소의 악마. 꿈은 평범한 생활." },
  { file: "10_Pochita.jpg", nameKr: "포치타", nameJp: "ポチタ", anime: "체인소 맨", species: "악마", desc: "체인소의 악마. 덴지의 심장이 되어준 강아지." },
  { file: "12_Satoru Gojo.jpg", nameKr: "고조 사토루", nameJp: "五条悟", anime: "주술회전", species: "인간", desc: "최강의 주술사. 무하한과 육안을 가진 사기캐." },
  { file: "13_Megumi Fushiguro.jpg", nameKr: "후시구로 메구미", nameJp: "伏黒恵", anime: "주술회전", species: "인간", desc: "십종영보를 다루는 1학년. 냉정하지만 속정 깊음." },
  { file: "14_Nobara Kugisaki.jpg", nameKr: "쿠기사키 노바라", nameJp: "釘崎野薔薇", anime: "주술회전", species: "인간", desc: "못과 망치로 싸우는 1학년. 자기 자신에 대한 확신이 강함." },
  { file: "16_Kento Nanami.jpg", nameKr: "나나미 켄토", nameJp: "七海建人", anime: "주술회전", species: "인간", desc: "탈샐러리맨 주술사. 시간 외 근무를 싫어하는 프로." },
  { file: "18_Toge Inumaki.jpg", nameKr: "이누마키 토게", nameJp: "狗巻棘", anime: "주술회전", species: "인간", desc: "주언사. 말이 곧 저주라서 주먹밥 재료로만 대화함." },
  { file: "19_Panda.jpg", nameKr: "판다", nameJp: "パンダ", anime: "주술회전", species: "저주시해", desc: "판다가 아니라 판다야. 야가 학장이 만든 돌연변이 저주시해." },
  { file: "20_Maki Zenin.jpg", nameKr: "젠인 마키", nameJp: "禪院真希", anime: "주술회전", species: "인간", desc: "주력 제로의 피지컬 파이터. 젠인 가문을 뒤엎은 여전사." },
  { file: "21_Frieren.jpg", nameKr: "프리렌", nameJp: "フリーレン", anime: "장송의 프리렌", species: "엘프", desc: "천 년을 사는 마법사. 인간을 알아가는 여정 중." },
  { file: "22_Fern.jpg", nameKr: "페른", nameJp: "フェルン", anime: "장송의 프리렌", species: "인간", desc: "프리렌의 제자. 꼼꼼하고 잔소리 담당이지만 실력자." },
  { file: "23_Stark.jpg", nameKr: "슈타르크", nameJp: "シュタルク", anime: "장송의 프리렌", species: "인간", desc: "아이젠의 제자 전사. 겁쟁이지만 누구보다 용감함." },
  { file: "24_Himmel.jpg", nameKr: "힘멜", nameJp: "ヒンメル", anime: "장송의 프리렌", species: "인간", desc: "용사 파티의 리더. 프리렌의 마음을 움직인 사람." },
  { file: "25_Eisen.jpg", nameKr: "아이젠", nameJp: "アイゼン", anime: "장송의 프리렌", species: "드워프", desc: "용사 파티의 전사. 슈타르크의 스승이자 묵직한 든든함." },
  { file: "26_Heiter.jpg", nameKr: "하이터", nameJp: "ハイター", anime: "장송의 프리렌", species: "인간", desc: "용사 파티의 승려. 페른을 키운 술 좋아하는 성직자." },
  { file: "27_Serie.jpg", nameKr: "제리에", nameJp: "ゼーリエ", anime: "장송의 프리렌", species: "엘프", desc: "대륙 마법 협회의 수장. 프리렌보다 오래 산 대마법사." },
  { file: "28_Sein.jpg", nameKr: "자인", nameJp: "ザイン", anime: "장송의 프리렌", species: "인간", desc: "승려이자 도박꾼. 현실적이지만 결국 동료를 택하는 남자." },
];

const AVATAR_FILES = CHARACTERS.map((c) => c.file);

const CHARACTER_BY_FILE = Object.fromEntries(
  CHARACTERS.map((c) => [c.file, c])
);

const MAX_NOTES = 20;
const NOTE_WIDTH = 200;
const NOTE_HEIGHT = 160;

function getRandomRotation() {
  return Math.round((Math.random() * 6 - 3) * 10) / 10;
}

function formatTimeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function getCharacterFromUrl(url: string): CharacterInfo | undefined {
  const filename = decodeURIComponent(url.split("/").pop() || "");
  return CHARACTER_BY_FILE[filename];
}

function getAvatarName(url: string) {
  const char = getCharacterFromUrl(url);
  return char?.nameKr || decodeURIComponent(url.split("/").pop() || "").replace(/\.\w+$/, "").replace(/^\d+_/, "");
}

export default function PostItContent() {
  const [notes, setNotes] = useState<PostIt[]>([]);
  const [floatingNote, setFloatingNote] = useState<{
    id: string;
    color: string;
    rotation: number;
    avatar_url: string;
  } | null>(null);
  const [avatarUrls] = useState<string[]>(() =>
    AVATAR_FILES.map(
      (f) =>
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${encodeURIComponent(f)}`
    )
  );
  const [fingerprint, setFingerprint] = useState<string | null>(null);
  const [hasPosted, setHasPosted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const boardRef = useRef<HTMLDivElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });

  const dbNoteCount = notes.filter((n) => !n.isNew).length;
  const remaining = MAX_NOTES - dbNoteCount;
  const canPeel = fingerprint !== null;

  useEffect(() => {
    async function init() {
      const [fpResult, notesResult] = await Promise.all([
        FingerprintJS.load().then((fp) => fp.get()),
        supabase.from("post_it_notes").select("*").order("created_at", { ascending: true }),
      ]);

      const visitorId = fpResult.visitorId;
      setFingerprint(visitorId);

      if (notesResult.data) {
        const loaded: PostIt[] = notesResult.data.map((n: PostItNote) => ({
          id: n.id, x: n.x, y: n.y, content: n.content, color: n.color,
          rotation: n.rotation, avatar_url: n.avatar_url, created_at: n.created_at,
          isEditing: false, isNew: false,
        }));
        setNotes(loaded);
        setHasPosted(notesResult.data.some((n: PostItNote) => n.fingerprint === visitorId));
      }
      setIsLoading(false);
    }
    init();
  }, []);

  const getRandomAvatarUrl = useCallback(() => {
    if (avatarUrls.length === 0) return "";
    return avatarUrls[Math.floor(Math.random() * avatarUrls.length)];
  }, [avatarUrls]);

  const handleStackMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!canPeel || remaining <= 0) return;
      e.preventDefault();
      e.stopPropagation();
      const color = PALETTES[notes.length % PALETTES.length];
      mousePos.current = { x: e.clientX, y: e.clientY };
      setFloatingNote({
        id: crypto.randomUUID(),
        color,
        rotation: getRandomRotation(),
        avatar_url: getRandomAvatarUrl(),
      });
    },
    [canPeel, remaining, notes.length, getRandomAvatarUrl]
  );

  useEffect(() => {
    if (!floatingNote) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (floatingRef.current) {
        floatingRef.current.style.left = `${e.clientX - NOTE_WIDTH / 2}px`;
        floatingRef.current.style.top = `${e.clientY - NOTE_HEIGHT / 2}px`;
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!boardRef.current) return;
      const rect = boardRef.current.getBoundingClientRect();
      const x = ((e.clientX - NOTE_WIDTH / 2 - rect.left) / rect.width) * 100;
      const y = ((e.clientY - NOTE_HEIGHT / 2 - rect.top) / rect.height) * 100;

      const newNote: PostIt = {
        id: floatingNote.id,
        x: Math.max(0, Math.min(85, x)),
        y: Math.max(0, Math.min(85, y)),
        content: "",
        color: floatingNote.color,
        rotation: floatingNote.rotation,
        avatar_url: floatingNote.avatar_url,
        created_at: new Date().toISOString(),
        isEditing: true,
        isNew: true,
      };
      setNotes((prev) => [...prev, newNote]);
      setFloatingNote(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [floatingNote]);

  const handleNoteSubmit = useCallback(
    async (id: string, content: string) => {
      if (!content.trim()) {
        setNotes((prev) => prev.filter((n) => n.id !== id));
        return;
      }

      const note = notes.find((n) => n.id === id);
      if (!note || !fingerprint) return;

      if (hasPosted) {
        setNotes((prev) =>
          prev.map((n) => (n.id === id ? { ...n, content, isEditing: false } : n))
        );
        toast("체험용 포스트잇이에요! (새로고침하면 사라져요)", { icon: "✨" });
        return;
      }

      const { data, error } = await supabase
        .from("post_it_notes")
        .insert({
          content: content.trim(), x: note.x, y: note.y,
          color: note.color, rotation: note.rotation,
          fingerprint, avatar_url: note.avatar_url,
        })
        .select()
        .single();

      if (error) {
        if (error.code === "23505") toast.error("이미 포스트잇을 남기셨어요!");
        else if (error.message?.includes("Maximum")) toast.error("포스트잇이 모두 소진되었어요!");
        else toast.error("저장에 실패했어요. 다시 시도해주세요.");
        setNotes((prev) => prev.filter((n) => n.id !== id));
        return;
      }

      setNotes((prev) =>
        prev.map((n) =>
          n.id === id
            ? { ...n, id: data.id, content: data.content, created_at: data.created_at, isEditing: false, isNew: false }
            : n
        )
      );
      setHasPosted(true);
      toast.success("포스트잇이 저장되었어요!");
    },
    [notes, fingerprint, hasPosted]
  );

  const handleNoteMove = useCallback(
    (id: string, newX: number, newY: number) => {
      setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, x: newX, y: newY } : n)));
    },
    []
  );

  if (isLoading) {
    return null;
  }

  return (
    <div
      ref={boardRef}
      className="pointer-events-none absolute inset-0"
    >
      <AnimatePresence>
        {notes.map((note) => (
          <PlacedNote
            key={note.id}
            note={note}
            onSubmit={handleNoteSubmit}
            onMove={handleNoteMove}
            boardRef={boardRef}
          />
        ))}
      </AnimatePresence>

      {/* Floating note (fixed to viewport for cross-window drag) */}
      {floatingNote && (
        <motion.div
          ref={floatingRef}
          className="pointer-events-none fixed z-[10000]"
          style={{
            left: mousePos.current.x - NOTE_WIDTH / 2,
            top: mousePos.current.y - NOTE_HEIGHT / 2,
          }}
          initial={{ scale: 0.5, opacity: 0, rotate: 0 }}
          animate={{ scale: 1.06, opacity: 1, rotate: floatingNote.rotation - 4 }}
          transition={{ type: "spring", stiffness: 500, damping: 22 }}
        >
          <div
            style={{
              width: NOTE_WIDTH, height: NOTE_HEIGHT,
              background: floatingNote.color, border: "3px solid #000",
              boxShadow: "6px 6px 0 #000",
            }}
          >
            <div
              className="flex h-full items-center justify-center"
              style={{ fontFamily: "'Space Grotesk', monospace", fontSize: 14, fontWeight: 700, color: "#00000040" }}
            >
              DROP HERE
            </div>
          </div>
        </motion.div>
      )}

      {/* Stack */}
      <div className="pointer-events-auto absolute bottom-24 left-1/2 -translate-x-1/2" style={{ zIndex: 0 }}>
        <div className="flex flex-col items-center gap-2">
          <motion.div
            key={remaining}
            initial={{ scale: 1.4, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
            style={{
              fontFamily: "'Space Grotesk', monospace", fontSize: 13, fontWeight: 800,
              background: remaining > 0 ? "#FFE66D" : "#ccc", color: "#000",
              padding: "3px 12px", border: "3px solid #000", boxShadow: "3px 3px 0 #000",
            }}
          >
            {remaining}/{MAX_NOTES}
          </motion.div>

          <div className="relative" style={{ width: 140, height: 120 }}>
            {remaining > 0 &&
              Array.from({ length: Math.min(remaining, 4) }).map((_, i) => (
                <div
                  key={`stack-${i}-${remaining}`}
                  className="absolute"
                  style={{
                    width: 140, height: 120,
                    background: PALETTES[(notes.length + i) % PALETTES.length],
                    border: "3px solid #000", bottom: i * 3, left: i * 2,
                    transform: `rotate(${(i - 1.5) * 2}deg)`, opacity: 0.5 + i * 0.12,
                  }}
                />
              ))}

            {remaining > 0 ? (
              <motion.div
                className="absolute cursor-grab active:cursor-grabbing"
                style={{
                  width: 140, height: 120,
                  background: PALETTES[notes.length % PALETTES.length],
                  border: "3px solid #000", boxShadow: "4px 4px 0 #000",
                  bottom: Math.min(remaining, 4) * 3, left: 0, zIndex: 10,
                }}
                onMouseDown={handleStackMouseDown}
                whileHover={{ scale: 1.06, rotate: -3, y: -6, boxShadow: "6px 6px 0 #000" }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
              >
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2"
                  style={{ width: 45, height: 18, background: "rgba(255,255,255,0.5)", border: "2px solid #00000020", transform: "rotate(-2deg)" }}
                />
                <div
                  className="flex h-full flex-col items-center justify-center gap-1"
                  style={{ fontFamily: "'Space Grotesk', monospace", fontWeight: 800, color: "#000" }}
                >
                  <span style={{ fontSize: 20 }}>PEEL ME</span>
                  <span style={{ fontSize: 10, opacity: 0.4 }}>↕ drag to place</span>
                </div>
              </motion.div>
            ) : (
              <div
                className="absolute flex items-center justify-center"
                style={{
                  width: 140, height: 120, background: "#E0E0E0",
                  border: "3px dashed #999", bottom: 0, left: 0,
                  fontFamily: "'Space Grotesk', monospace", fontSize: 12, fontWeight: 700, color: "#999",
                }}
              >
                ALL USED UP
              </div>
            )}
          </div>
        </div>
      </div>

      <Toaster
        position="top-right"
        offset="60px"
        toastOptions={{
          style: {
            fontFamily: "'Space Grotesk', monospace", fontWeight: 700,
            border: "2px solid #000", boxShadow: "3px 3px 0 #000",
          },
        }}
      />
    </div>
  );
}

function AvatarBadge({ avatarUrl }: { avatarUrl: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const badgeRef = useRef<HTMLDivElement>(null);
  const [popoverPos, setPopoverPos] = useState({ top: 0, right: 0 });
  const char = getCharacterFromUrl(avatarUrl);

  const handleMouseEnter = () => {
    if (!badgeRef.current) return;
    const rect = badgeRef.current.getBoundingClientRect();
    setPopoverPos({ top: rect.top - 4, right: window.innerWidth - rect.right });
    setIsHovered(true);
  };

  return (
    <>
      <div
        ref={badgeRef}
        className="absolute -top-9 -right-3"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="flex cursor-pointer items-center gap-1.5"
          style={{ background: "#fff", border: "2.5px solid #000", boxShadow: "3px 3px 0 #000", padding: "2px 8px 2px 2px" }}
        >
          <img
            src={avatarUrl}
            alt=""
            style={{ width: 28, height: 28, borderRadius: "50%", border: "2px solid #000", objectFit: "cover" }}
          />
          <span style={{ fontFamily: "'Space Grotesk', monospace", fontSize: 10, fontWeight: 800, color: "#000", maxWidth: 70, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {getAvatarName(avatarUrl)}
          </span>
        </div>
      </div>

      {isHovered && char && createPortal(
        <div
          className="fixed w-48"
          style={{
            top: popoverPos.top,
            right: popoverPos.right,
            transform: "translateY(-100%)",
            zIndex: 999999,
            fontFamily: "'Space Grotesk', monospace",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div style={{ background: "#fff", border: "2.5px solid #000", boxShadow: "4px 4px 0 #000", padding: "10px" }}>
            <div className="flex items-center gap-2">
              <img
                src={avatarUrl}
                alt=""
                style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid #000", objectFit: "cover" }}
              />
              <div>
                <p style={{ fontSize: 12, fontWeight: 800, color: "#000" }}>{char.nameKr}</p>
                <p style={{ fontSize: 9, fontWeight: 600, color: "#555" }}>{char.nameJp}</p>
              </div>
            </div>
            <p className="mt-1.5" style={{ fontSize: 9, fontWeight: 600, color: "#000", lineHeight: 1.5 }}>
              {char.desc}
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1">
              <span style={{ background: "#FFE66D", border: "1.5px solid #000", padding: "1px 6px", fontSize: 9, fontWeight: 800, color: "#000" }}>
                {char.anime}
              </span>
              <span style={{ background: "#A8E6CF", border: "1.5px solid #000", padding: "1px 6px", fontSize: 9, fontWeight: 800, color: "#000" }}>
                {char.species}
              </span>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

function PlacedNote({
  note,
  onSubmit,
  onMove,
  boardRef,
}: {
  note: PostIt;
  onSubmit: (id: string, content: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  boardRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [text, setText] = useState(note.content);
  const [isDragging, setIsDragging] = useState(false);
  const noteRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (note.isEditing) return;
      e.preventDefault();
      e.stopPropagation();
      const el = noteRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      setIsDragging(true);

      const handleMouseMove = (ev: MouseEvent) => {
        if (!boardRef.current) return;
        const deskRect = boardRef.current.getBoundingClientRect();
        if (el) {
          el.style.left = `${ev.clientX - dragOffset.current.x - deskRect.left}px`;
          el.style.top = `${ev.clientY - dragOffset.current.y - deskRect.top}px`;
        }
      };

      const handleMouseUp = (ev: MouseEvent) => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        setIsDragging(false);
        if (!boardRef.current) return;
        const deskRect = boardRef.current.getBoundingClientRect();
        const newLeft = ev.clientX - dragOffset.current.x - deskRect.left;
        const newTop = ev.clientY - dragOffset.current.y - deskRect.top;
        onMove(note.id, Math.max(0, Math.min(85, (newLeft / deskRect.width) * 100)), Math.max(0, Math.min(85, (newTop / deskRect.height) * 100)));
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [note.isEditing, note.id, onMove, boardRef]
  );

  return (
    <motion.div
      ref={noteRef}
      className="pointer-events-auto absolute"
      style={{
        left: `${note.x}%`, top: `${note.y}%`,
        zIndex: isDragging ? 3 : note.isEditing ? 2 : 0,
        cursor: note.isEditing ? "default" : isDragging ? "grabbing" : "grab",
      }}
      initial={note.isNew ? { scale: 1.06, opacity: 0, rotate: note.rotation - 4 } : { scale: 0.9, opacity: 0, rotate: note.rotation }}
      animate={isDragging ? { scale: 1.06, opacity: 1, rotate: note.rotation - 2 } : { scale: 1, opacity: 1, rotate: note.rotation }}
      exit={{ scale: 0, opacity: 0, rotate: note.rotation + 10 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      whileHover={!note.isEditing && !isDragging ? { scale: 1.04, rotate: note.rotation - 1.5, zIndex: 1 } : {}}
      onMouseDown={handleMouseDown}
    >
      <div
        className="relative p-3"
        style={{
          width: NOTE_WIDTH, minHeight: NOTE_HEIGHT,
          background: note.color, border: "3px solid #000",
          boxShadow: isDragging ? "8px 8px 0 #000" : "4px 4px 0 #000",
          transition: "box-shadow 0.15s ease",
        }}
      >
        <div
          className="absolute -top-3 left-4"
          style={{ width: 36, height: 14, background: "rgba(255,255,255,0.45)", border: "2px solid #00000015", transform: `rotate(${note.rotation > 0 ? -3 : 3}deg)` }}
        />

        {note.avatar_url && (
          <AvatarBadge avatarUrl={note.avatar_url} />
        )}

        {note.isEditing ? (
          <div className="flex flex-col gap-2">
            <textarea
              autoFocus
              maxLength={100}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (text.trim() && noteRef.current) {
                    const rect = noteRef.current.getBoundingClientRect();
                    fireConfetti((rect.left + rect.width / 2) / window.innerWidth, (rect.top + rect.height / 2) / window.innerHeight);
                  }
                  onSubmit(note.id, text);
                }
              }}
              className="w-full resize-none bg-transparent outline-none"
              style={{ fontFamily: "'Space Grotesk', monospace", fontSize: 13, fontWeight: 600, color: "#000", minHeight: 70, lineHeight: 1.6 }}
              placeholder="write something..."
            />
            <div className="flex items-center justify-between">
              <span style={{ fontFamily: "monospace", fontSize: 10, fontWeight: 700, color: "#00000040" }}>{text.length}/100</span>
              <button
                onClick={(e) => {
                  if (!text.trim()) { onSubmit(note.id, text); return; }
                  const rect = e.currentTarget.getBoundingClientRect();
                  fireConfetti((rect.left + rect.width / 2) / window.innerWidth, (rect.top + rect.height / 2) / window.innerHeight);
                  onSubmit(note.id, text);
                }}
                style={{
                  background: "#000", color: note.color, padding: "3px 12px",
                  fontFamily: "'Space Grotesk', monospace", fontSize: 11, fontWeight: 800,
                  border: "2px solid #000", boxShadow: "2px 2px 0 #000", cursor: "pointer",
                }}
              >
                STICK!
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p style={{ fontFamily: "'Space Grotesk', monospace", fontSize: 13, fontWeight: 600, color: "#000", lineHeight: 1.6, wordBreak: "break-word" }}>
              {note.content}
            </p>
            <div className="mt-2" style={{ fontFamily: "monospace", fontSize: 9, fontWeight: 700, color: "#00000040" }}>
              {formatTimeAgo(note.created_at)}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
