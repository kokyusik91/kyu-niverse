"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { supabase, type PostItNote } from "@/lib/supabase";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { toast, Toaster } from "sonner";

function fireConfetti(x: number, y: number) {
  const origin = { x, y };
  const colors = ["#FF6B6B", "#4ECDC4", "#FFE66D", "#A8E6CF", "#DDA0DD", "#87CEEB", "#FF8B94", "#000"];

  confetti({
    particleCount: 100,
    spread: 100,
    origin,
    colors,
    ticks: 80,
    gravity: 0.8,
    scalar: 1.1,
    startVelocity: 30,
  });

  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 60,
      origin: { x: x - 0.05, y },
      colors,
      ticks: 70,
      gravity: 1,
      scalar: 0.8,
      startVelocity: 25,
    });
  }, 100);

  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 60,
      origin: { x: x + 0.05, y },
      colors,
      ticks: 70,
      gravity: 1,
      scalar: 0.8,
      startVelocity: 25,
    });
  }, 200);
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

const AVATAR_FILES = [
  "1_Denji.jpg", "10_Pochita.jpg", "12_Satoru Gojo.jpg",
  "13_Megumi Fushiguro.jpg", "14_Nobara Kugisaki.jpg",
  "16_Kento Nanami.jpg", "18_Toge Inumaki.jpg", "19_Panda.jpg",
  "20_Maki Zenin.jpg", "21_Frieren.jpg", "22_Fern.jpg",
  "23_Stark.jpg", "24_Himmel.jpg", "25_Eisen.jpg",
  "26_Heiter.jpg", "27_Serie.jpg", "28_Sein.jpg",
];

const MAX_NOTES = 20;
const NOTE_WIDTH = 220;
const NOTE_HEIGHT = 180;

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

function getAvatarName(url: string) {
  const filename = decodeURIComponent(url.split("/").pop() || "");
  const withoutExt = filename.replace(/\.\w+$/, "");
  const withoutPrefix = withoutExt.replace(/^\d+_/, "");
  return withoutPrefix;
}

export default function PostItNeoPage() {
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
  const desktopRef = useRef<HTMLDivElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });

  const dbNoteCount = notes.filter((n) => !n.isNew).length;
  const remaining = MAX_NOTES - dbNoteCount;
  const canPeel = fingerprint !== null;

  // 초기 데이터 로드: fingerprint + 아바타 목록 + 기존 노트
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
          id: n.id,
          x: n.x,
          y: n.y,
          content: n.content,
          color: n.color,
          rotation: n.rotation,
          avatar_url: n.avatar_url,
          created_at: n.created_at,
          isEditing: false,
          isNew: false,
        }));
        setNotes(loaded);

        const alreadyPosted = notesResult.data.some(
          (n: PostItNote) => n.fingerprint === visitorId
        );
        setHasPosted(alreadyPosted);
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
      const color = PALETTES[notes.length % PALETTES.length];
      mousePos.current = { x: e.clientX, y: e.clientY };
      setFloatingNote({
        id: crypto.randomUUID(),
        color,
        rotation: getRandomRotation(),
        avatar_url: getRandomAvatarUrl(),
      });
    },
    [canPeel, notes.length, getRandomAvatarUrl]
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
      if (!desktopRef.current) return;
      const rect = desktopRef.current.getBoundingClientRect();
      const x = ((e.clientX - NOTE_WIDTH / 2 - rect.left) / rect.width) * 100;
      const y = ((e.clientY - NOTE_HEIGHT / 2 - rect.top) / rect.height) * 100;
      const clampedX = Math.max(0, Math.min(85, x));
      const clampedY = Math.max(0, Math.min(80, y));

      const newNote: PostIt = {
        id: floatingNote.id,
        x: clampedX,
        y: clampedY,
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

      // 이미 DB에 남긴 사람은 로컬에만 표시 (체험용)
      if (hasPosted) {
        setNotes((prev) =>
          prev.map((n) =>
            n.id === id ? { ...n, content, isEditing: false } : n
          )
        );
        toast("체험용 포스트잇이에요! (새로고침하면 사라져요)", {
          icon: "✨",
        });
        return;
      }

      const { data, error } = await supabase
        .from("post_it_notes")
        .insert({
          content: content.trim(),
          x: note.x,
          y: note.y,
          color: note.color,
          rotation: note.rotation,
          fingerprint,
          avatar_url: note.avatar_url,
        })
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          toast.error("이미 포스트잇을 남기셨어요!");
        } else if (error.message?.includes("Maximum")) {
          toast.error("포스트잇이 모두 소진되었어요!");
        } else {
          toast.error("저장에 실패했어요. 다시 시도해주세요.");
        }
        setNotes((prev) => prev.filter((n) => n.id !== id));
        return;
      }

      setNotes((prev) =>
        prev.map((n) =>
          n.id === id
            ? {
                ...n,
                id: data.id,
                content: data.content,
                created_at: data.created_at,
                isEditing: false,
                isNew: false,
              }
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
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, x: newX, y: newY } : n))
      );
    },
    []
  );

  if (isLoading) {
    return (
      <div
        className="relative w-screen h-screen overflow-hidden"
        style={{
          background: "#F5F0E8",
          backgroundImage:
            "radial-gradient(circle, #00000020 1.5px, transparent 1.5px)",
          backgroundSize: "20px 20px",
        }}
      >
        {/* Skeleton notes */}
        {[
          { x: 15, y: 12, w: 220, h: 180, rotate: -2 },
          { x: 55, y: 8, w: 220, h: 160, rotate: 1.5 },
          { x: 35, y: 45, w: 220, h: 170, rotate: -1 },
          { x: 65, y: 50, w: 220, h: 180, rotate: 2.5 },
        ].map((s, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.w,
              height: s.h,
              background: "#e5e0d8",
              border: "3px solid #ccc",
              boxShadow: "4px 4px 0 #ccc",
              transform: `rotate(${s.rotate}deg)`,
            }}
          />
        ))}
        {/* Skeleton stack */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
          <div
            className="animate-pulse"
            style={{
              width: 160,
              height: 140,
              background: "#e5e0d8",
              border: "3px solid #ccc",
              boxShadow: "4px 4px 0 #ccc",
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={desktopRef}
      className="relative w-screen h-screen overflow-hidden select-none"
      style={{
        background: "#F5F0E8",
        backgroundImage:
          "radial-gradient(circle, #00000020 1.5px, transparent 1.5px)",
        backgroundSize: "20px 20px",
      }}
    >
      {/* Title */}
      <div className="absolute top-5 left-5 z-50">
        <div
          style={{
            background: "#000",
            color: "#fff",
            padding: "8px 16px",
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: -0.5,
            border: "3px solid #000",
            boxShadow: "4px 4px 0 #000",
          }}
        >
          NEO POST-IT
        </div>
        <p
          style={{
            fontFamily: "monospace",
            fontSize: 13,
            color: "#666",
            marginTop: 8,
          }}
        >
          drag a note from the stack. drop it anywhere.
        </p>
      </div>

      {/* Placed notes */}
      <AnimatePresence>
        {notes.map((note) => (
          <NeoPlacedNote
            key={note.id}
            note={note}
            onSubmit={handleNoteSubmit}
            onMove={handleNoteMove}
            desktopRef={desktopRef}
          />
        ))}
      </AnimatePresence>

      {/* Floating note */}
      {floatingNote && (
        <motion.div
          ref={floatingRef}
          className="fixed pointer-events-none z-[100]"
          style={{
            left: mousePos.current.x - NOTE_WIDTH / 2,
            top: mousePos.current.y - NOTE_HEIGHT / 2,
          }}
          initial={{ scale: 0.5, opacity: 0, rotate: 0 }}
          animate={{
            scale: 1.06,
            opacity: 1,
            rotate: floatingNote.rotation - 4,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 22 }}
        >
          <div
            style={{
              width: NOTE_WIDTH,
              height: NOTE_HEIGHT,
              background: floatingNote.color,
              border: "3px solid #000",
              boxShadow: "6px 6px 0 #000",
            }}
          >
            <div
              className="flex items-center justify-center h-full"
              style={{
                fontFamily: "'Space Grotesk', monospace",
                fontSize: 14,
                fontWeight: 700,
                color: "#00000040",
              }}
            >
              DROP HERE
            </div>
          </div>
        </motion.div>
      )}

      {/* Post-it Stack */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-40">
        <div className="flex flex-col items-center gap-3">
          {/* Counter */}
          <motion.div
            key={remaining}
            initial={{ scale: 1.4, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
            style={{
              fontFamily: "'Space Grotesk', monospace",
              fontSize: 14,
              fontWeight: 800,
              background: remaining > 0 ? "#FFE66D" : "#ccc",
              color: "#000",
              padding: "4px 14px",
              border: "3px solid #000",
              boxShadow: "3px 3px 0 #000",
            }}
          >
            {remaining}/{MAX_NOTES}
          </motion.div>

          {/* Stack */}
          <div className="relative" style={{ width: 160, height: 140 }}>
            {remaining > 0 &&
              Array.from({ length: Math.min(remaining, 4) }).map((_, i) => (
                <div
                  key={`stack-${i}-${remaining}`}
                  className="absolute"
                  style={{
                    width: 160,
                    height: 140,
                    background: PALETTES[(notes.length + i) % PALETTES.length],
                    border: "3px solid #000",
                    bottom: i * 4,
                    left: i * 2,
                    transform: `rotate(${(i - 1.5) * 2}deg)`,
                    opacity: 0.5 + i * 0.12,
                  }}
                />
              ))}

            {remaining > 0 ? (
              <motion.div
                className="absolute cursor-grab active:cursor-grabbing"
                style={{
                  width: 160,
                  height: 140,
                  background: PALETTES[notes.length % PALETTES.length],
                  border: "3px solid #000",
                  boxShadow: "4px 4px 0 #000",
                  bottom: Math.min(remaining, 4) * 4,
                  left: 0,
                  zIndex: 10,
                }}
                onMouseDown={handleStackMouseDown}
                whileHover={{
                  scale: 1.06,
                  rotate: -3,
                  y: -6,
                  boxShadow: "6px 6px 0 #000",
                }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
              >
                {/* Tape effect */}
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2"
                  style={{
                    width: 50,
                    height: 20,
                    background: "rgba(255,255,255,0.5)",
                    border: "2px solid #00000020",
                    transform: "rotate(-2deg)",
                  }}
                />
                <div
                  className="flex flex-col items-center justify-center h-full gap-1"
                  style={{
                    fontFamily: "'Space Grotesk', monospace",
                    fontWeight: 800,
                    color: "#000000",
                  }}
                >
                  <span style={{ fontSize: 22 }}>PEEL ME</span>
                  <span style={{ fontSize: 11, opacity: 0.4 }}>
                    ↕ drag to place
                  </span>
                </div>
              </motion.div>
            ) : (
              <div
                className="absolute flex items-center justify-center"
                style={{
                  width: 160,
                  height: 140,
                  background: "#E0E0E0",
                  border: "3px dashed #999",
                  bottom: 0,
                  left: 0,
                  fontFamily: "'Space Grotesk', monospace",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#999",
                }}
              >
                ALL USED UP
              </div>
            )}
          </div>
        </div>
      </div>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            fontFamily: "'Space Grotesk', monospace",
            fontWeight: 700,
            border: "2px solid #000",
            boxShadow: "3px 3px 0 #000",
          },
        }}
      />
    </div>
  );
}

function NeoPlacedNote({
  note,
  onSubmit,
  onMove,
  desktopRef,
}: {
  note: PostIt;
  onSubmit: (id: string, content: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  desktopRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [text, setText] = useState(note.content);
  const [isDragging, setIsDragging] = useState(false);
  const noteRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (note.isEditing) return;
      e.preventDefault();
      const el = noteRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      dragOffset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      setIsDragging(true);

      const handleMouseMove = (ev: MouseEvent) => {
        if (!desktopRef.current) return;
        const deskRect = desktopRef.current.getBoundingClientRect();
        const newLeft = ev.clientX - dragOffset.current.x - deskRect.left;
        const newTop = ev.clientY - dragOffset.current.y - deskRect.top;
        if (el) {
          el.style.left = `${newLeft}px`;
          el.style.top = `${newTop}px`;
        }
      };

      const handleMouseUp = (ev: MouseEvent) => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        setIsDragging(false);
        if (!desktopRef.current) return;
        const deskRect = desktopRef.current.getBoundingClientRect();
        const newLeft = ev.clientX - dragOffset.current.x - deskRect.left;
        const newTop = ev.clientY - dragOffset.current.y - deskRect.top;
        const xPct = Math.max(0, Math.min(85, (newLeft / deskRect.width) * 100));
        const yPct = Math.max(0, Math.min(80, (newTop / deskRect.height) * 100));
        onMove(note.id, xPct, yPct);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [note.isEditing, note.id, onMove, desktopRef]
  );

  return (
    <motion.div
      ref={noteRef}
      className="absolute"
      style={{
        left: `${note.x}%`,
        top: `${note.y}%`,
        zIndex: isDragging ? 60 : note.isEditing ? 50 : 10,
        cursor: note.isEditing ? "default" : isDragging ? "grabbing" : "grab",
      }}
      initial={
        note.isNew
          ? { scale: 1.06, opacity: 0, rotate: note.rotation - 4 }
          : { scale: 0.9, opacity: 0, rotate: note.rotation }
      }
      animate={
        isDragging
          ? { scale: 1.06, opacity: 1, rotate: note.rotation - 2 }
          : { scale: 1, opacity: 1, rotate: note.rotation }
      }
      exit={{ scale: 0, opacity: 0, rotate: note.rotation + 10 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      whileHover={
        !note.isEditing && !isDragging
          ? { scale: 1.04, rotate: note.rotation - 1.5, zIndex: 30 }
          : {}
      }
      onMouseDown={handleMouseDown}
    >
      <div
        className="relative p-4"
        style={{
          width: NOTE_WIDTH,
          minHeight: NOTE_HEIGHT,
          background: note.color,
          border: "3px solid #000",
          boxShadow: isDragging ? "8px 8px 0 #000" : "4px 4px 0 #000",
          transition: "box-shadow 0.15s ease",
        }}
      >
        {/* Tape on top */}
        <div
          className="absolute -top-3 left-4"
          style={{
            width: 40,
            height: 16,
            background: "rgba(255,255,255,0.45)",
            border: "2px solid #00000015",
            transform: `rotate(${note.rotation > 0 ? -3 : 3}deg)`,
          }}
        />

        {/* Avatar badge — always visible */}
        {note.avatar_url && (
          <div
            className="absolute -top-10 -right-4 flex items-center gap-1.5"
            style={{
              background: "#fff",
              border: "2.5px solid #000",
              boxShadow: "3px 3px 0 #000",
              padding: "3px 10px 3px 3px",
              zIndex: 5,
            }}
          >
            <img
              src={note.avatar_url}
              alt=""
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                border: "2.5px solid #000",
                objectFit: "cover",
              }}
            />
            <span
              style={{
                fontFamily: "'Space Grotesk', monospace",
                fontSize: 11,
                fontWeight: 800,
                color: "#000",
                maxWidth: 80,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {getAvatarName(note.avatar_url)}
            </span>
          </div>
        )}

        {note.isEditing ? (
          <div className="flex flex-col gap-3">
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
                    fireConfetti(
                      (rect.left + rect.width / 2) / window.innerWidth,
                      (rect.top + rect.height / 2) / window.innerHeight
                    );
                  }
                  onSubmit(note.id, text);
                }
              }}
              className="w-full bg-transparent resize-none outline-none"
              style={{
                fontFamily: "'Space Grotesk', monospace",
                fontSize: 14,
                fontWeight: 600,
                color: "#000",
                minHeight: 80,
                lineHeight: 1.6,
              }}
              placeholder="write something..."
            />
            <div className="flex justify-between items-center">
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#00000040",
                }}
              >
                {text.length}/100
              </span>
              <button
                onClick={(e) => {
                  if (!text.trim()) {
                    onSubmit(note.id, text);
                    return;
                  }
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = (rect.left + rect.width / 2) / window.innerWidth;
                  const y = (rect.top + rect.height / 2) / window.innerHeight;
                  fireConfetti(x, y);
                  onSubmit(note.id, text);
                }}
                style={{
                  background: "#000",
                  color: note.color,
                  padding: "4px 14px",
                  fontFamily: "'Space Grotesk', monospace",
                  fontSize: 12,
                  fontWeight: 800,
                  border: "2px solid #000",
                  boxShadow: "2px 2px 0 #000",
                  cursor: "pointer",
                }}
              >
                STICK!
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p
              style={{
                fontFamily: "'Space Grotesk', monospace",
                fontSize: 14,
                fontWeight: 600,
                color: "#000",
                lineHeight: 1.6,
                wordBreak: "break-word",
              }}
            >
              {note.content}
            </p>
            <div
              className="mt-3"
              style={{
                fontFamily: "monospace",
                fontSize: 10,
                fontWeight: 700,
                color: "#00000040",
              }}
            >
              {formatTimeAgo(note.created_at)}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
