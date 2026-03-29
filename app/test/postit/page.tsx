"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PostIt {
  id: number;
  x: number;
  y: number;
  content: string;
  color: string;
  rotation: number;
  isEditing: boolean;
}

const COLORS = ["#FFE066", "#FF9AA2", "#B5EAD7", "#C7CEEA", "#FFDAC1"];
const MAX_NOTES = 20;
const NOTE_WIDTH = 200;
const NOTE_HEIGHT = 160;

function getRandomRotation() {
  return Math.round((Math.random() * 10 - 5) * 10) / 10;
}

export default function PostItTestPage() {
  const [notes, setNotes] = useState<PostIt[]>([]);
  const [floatingNote, setFloatingNote] = useState<{
    id: number;
    color: string;
    rotation: number;
  } | null>(null);
  const desktopRef = useRef<HTMLDivElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });

  const remaining = MAX_NOTES - notes.length;

  // Peel a note from the stack on mousedown
  const handleStackMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (remaining <= 0) return;
      e.preventDefault();

      mousePos.current = { x: e.clientX, y: e.clientY };
      setFloatingNote({
        id: Date.now(),
        color: COLORS[notes.length % COLORS.length],
        rotation: getRandomRotation(),
      });
    },
    [remaining, notes.length]
  );

  // Track mouse while dragging a floating note
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

      // Only place if within desktop bounds (not on taskbar)
      const clampedX = Math.max(0, Math.min(85, x));
      const clampedY = Math.max(0, Math.min(80, y));

      const newNote: PostIt = {
        id: floatingNote.id,
        x: clampedX,
        y: clampedY,
        content: "",
        color: floatingNote.color,
        rotation: floatingNote.rotation,
        isEditing: true,
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

  const handleNoteSubmit = (id: number, content: string) => {
    if (!content.trim()) {
      setNotes((prev) => prev.filter((n) => n.id !== id));
      return;
    }
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, content, isEditing: false } : n))
    );
  };

  const handleNoteMove = useCallback(
    (id: number, newX: number, newY: number) => {
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, x: newX, y: newY } : n))
      );
    },
    []
  );

  return (
    <div
      ref={desktopRef}
      className="relative w-screen h-screen overflow-hidden select-none"
      style={{
        background: "#ffffff",
        backgroundImage: "radial-gradient(circle, #00000018 1.5px, transparent 1.5px)",
        backgroundSize: "20px 20px",
      }}
    >
      {/* Title */}
      <div className="absolute top-4 left-4 z-50">
        <h1
          className="text-white text-xl font-bold"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          Post-it Test — Framer Motion
        </h1>
        <p className="text-gray-500 text-sm mt-1" style={{ fontFamily: "monospace" }}>
          포스트잇 뭉치에서 드래그해서 바탕화면에 붙여보세요
        </p>
      </div>

      {/* Placed notes */}
      <AnimatePresence>
        {notes.map((note) => (
          <PlacedNote
            key={note.id}
            note={note}
            onSubmit={handleNoteSubmit}
            onMove={handleNoteMove}
            desktopRef={desktopRef}
          />
        ))}
      </AnimatePresence>

      {/* Floating note (being dragged from stack) */}
      {floatingNote && (
        <motion.div
          ref={floatingRef}
          className="fixed pointer-events-none z-[100]"
          style={{
            left: mousePos.current.x - NOTE_WIDTH / 2,
            top: mousePos.current.y - NOTE_HEIGHT / 2,
          }}
          initial={{ scale: 0.6, opacity: 0, rotate: 0 }}
          animate={{
            scale: 1.08,
            opacity: 0.92,
            rotate: floatingNote.rotation - 5,
            boxShadow: "0 25px 50px rgba(0,0,0,0.35)",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <div
            className="rounded-sm"
            style={{
              width: NOTE_WIDTH,
              height: NOTE_HEIGHT,
              background: floatingNote.color,
            }}
          >
            <div
              className="absolute bottom-0 right-0 w-6 h-6"
              style={{
                background:
                  "linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.08) 50%)",
              }}
            />
            <div
              className="flex items-center justify-center h-full"
              style={{
                fontFamily: "monospace",
                fontSize: 12,
                color: "#00000040",
              }}
            >
              놓으면 여기에 붙어요
            </div>
          </div>
        </motion.div>
      )}

      {/* Post-it Stack */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-40">
        <div className="flex flex-col items-center gap-2">
          {/* Counter */}
          <motion.div
            className="text-xs font-semibold px-3 py-1 rounded-full"
            style={{
              fontFamily: "monospace",
              background: remaining > 0 ? "#C9A962" : "#333",
              color: remaining > 0 ? "#0A0A0A" : "#777",
            }}
            key={remaining}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            {remaining} / {MAX_NOTES}
          </motion.div>

          {/* Stack visual */}
          <div className="relative" style={{ width: 140, height: 140 }}>
            {/* Shadow layers to simulate stack thickness */}
            {remaining > 0 &&
              Array.from({ length: Math.min(remaining, 5) }).map((_, i) => (
                <motion.div
                  key={`shadow-${i}-${remaining}`}
                  className="absolute rounded-sm"
                  style={{
                    width: 140,
                    height: 140,
                    background: COLORS[(notes.length + i) % COLORS.length],
                    bottom: i * 2,
                    left: i * 0.5,
                    transform: `rotate(${(i - 2) * 1.5}deg)`,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 + i * 0.12 }}
                  transition={{ duration: 0.3 }}
                />
              ))}

            {/* Draggable top note */}
            {remaining > 0 ? (
              <motion.div
                className="absolute cursor-grab active:cursor-grabbing rounded-sm"
                style={{
                  width: 140,
                  height: 140,
                  background: COLORS[notes.length % COLORS.length],
                  bottom: Math.min(remaining, 5) * 2,
                  left: 0,
                  zIndex: 10,
                }}
                onMouseDown={handleStackMouseDown}
                whileHover={{
                  scale: 1.05,
                  rotate: -3,
                  y: -4,
                  boxShadow: "0 12px 24px rgba(0,0,0,0.25)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                {/* Corner peel effect */}
                <div
                  className="absolute bottom-0 right-0 w-7 h-7"
                  style={{
                    background:
                      "linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.1) 50%)",
                    borderRadius: "0 0 2px 0",
                  }}
                />
                <div
                  className="flex items-center justify-center h-full"
                  style={{
                    fontFamily: "monospace",
                    fontSize: 12,
                    color: "#00000050",
                  }}
                >
                  메모를 떼어주세요
                </div>
              </motion.div>
            ) : (
              <div
                className="absolute rounded-sm flex items-center justify-center"
                style={{
                  width: 140,
                  height: 140,
                  background: "#333",
                  bottom: 0,
                  left: 0,
                  fontFamily: "monospace",
                  fontSize: 11,
                  color: "#666",
                }}
              >
                모두 사용됨
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Taskbar mock */}
      <div
        className="absolute bottom-0 left-0 w-full h-12 flex items-center px-4 justify-between"
        style={{ background: "#0D0D1A" }}
      >
        <div
          className="flex items-center gap-2 px-3 py-1 rounded"
          style={{ background: "#1E1E3A" }}
        >
          <span
            style={{
              color: "#C9A962",
              fontFamily: "monospace",
              fontSize: 11,
            }}
          >
            START
          </span>
        </div>
        <span style={{ color: "#777", fontFamily: "monospace", fontSize: 12 }}>
          Post-it Test Mode
        </span>
      </div>
    </div>
  );
}

function PlacedNote({
  note,
  onSubmit,
  onMove,
  desktopRef,
}: {
  note: PostIt;
  onSubmit: (id: number, content: string) => void;
  onMove: (id: number, x: number, y: number) => void;
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

      // Capture where inside the note the user clicked
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
      initial={{ scale: 1.08, opacity: 0.9, rotate: note.rotation - 5 }}
      animate={
        isDragging
          ? {
              scale: 1.08,
              rotate: note.rotation - 3,
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
            }
          : {
              scale: 1,
              opacity: 1,
              rotate: note.rotation,
              boxShadow: "2px 3px 8px rgba(0,0,0,0.2)",
            }
      }
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      whileHover={
        !note.isEditing && !isDragging
          ? {
              scale: 1.05,
              rotate: note.rotation - 2,
              boxShadow: "0 12px 28px rgba(0,0,0,0.25)",
              zIndex: 30,
            }
          : {}
      }
      onMouseDown={handleMouseDown}
    >
      <div
        className="relative rounded-sm p-4"
        style={{
          width: NOTE_WIDTH,
          minHeight: NOTE_HEIGHT,
          background: note.color,
        }}
      >
        {/* Corner peel */}
        <div
          className="absolute bottom-0 right-0 w-5 h-5"
          style={{
            background:
              "linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.06) 50%)",
          }}
        />

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
                  onSubmit(note.id, text);
                }
              }}
              className="w-full bg-transparent resize-none outline-none placeholder-black/30"
              style={{
                fontFamily: "monospace",
                fontSize: 13,
                color: "#1a1a1a",
                minHeight: 80,
                lineHeight: 1.5,
              }}
              placeholder="여기에 메모를 남겨주세요..."
            />
            <div className="flex justify-between items-center">
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: 10,
                  color: "rgba(0,0,0,0.3)",
                }}
              >
                {text.length}/100
              </span>
              <button
                onClick={() => onSubmit(note.id, text)}
                className="px-3 py-1 rounded text-xs font-semibold"
                style={{
                  background: "#1a1a1a",
                  color: note.color,
                  fontFamily: "monospace",
                }}
              >
                붙이기
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p
              style={{
                fontFamily: "monospace",
                fontSize: 13,
                color: "#1a1a1a",
                lineHeight: 1.5,
                wordBreak: "break-word",
              }}
            >
              {note.content}
            </p>
            <p
              className="mt-3"
              style={{
                fontFamily: "monospace",
                fontSize: 10,
                color: "rgba(0,0,0,0.35)",
              }}
            >
              익명 · 방금 전
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
