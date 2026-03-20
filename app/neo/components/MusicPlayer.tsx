"use client";

import { useReducer, useRef, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  Music,
  SkipBack,
  SkipForward,
  Shuffle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Track {
  title: string;
  artist: string;
  src: string;
  cover: string;
}

const PLAYLIST: Track[] = [
  {
    title: "Neon Tears",
    artist: "SUNO AI",
    src: "/Neon Tears.mp3",
    cover: "/neon-light-2.jpg",
  },
  {
    title: "Dawn Blue",
    artist: "SUNO AI",
    src: "/Dawn Blue.mp3",
    cover: "/midnight.jpg",
  },
  {
    title: "残り火",
    artist: "SUNO AI",
    src: "/残り火.mp3",
    cover: "/molala.jpg",
  },
];

// --- State & Reducer ---

interface PlayerState {
  isOpen: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  trackIndex: number;
  shuffle: boolean;
  showPlaylist: boolean;
  trackDurations: Record<number, number>;
}

type PlayerAction =
  | { type: "TOGGLE_OPEN" }
  | { type: "TOGGLE_SHUFFLE" }
  | { type: "TOGGLE_PLAYLIST" }
  | { type: "SET_PLAYING"; playing: boolean }
  | { type: "SET_CURRENT_TIME"; time: number }
  | { type: "SET_DURATION"; duration: number }
  | { type: "SET_TRACK_DURATION"; index: number; duration: number }
  | { type: "LOAD_TRACK"; index: number };

const initialState: PlayerState = {
  isOpen: false,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  trackIndex: 0,
  shuffle: false,
  showPlaylist: false,
  trackDurations: {},
};

function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case "TOGGLE_OPEN":
      return { ...state, isOpen: !state.isOpen };
    case "TOGGLE_SHUFFLE":
      return { ...state, shuffle: !state.shuffle };
    case "TOGGLE_PLAYLIST":
      return { ...state, showPlaylist: !state.showPlaylist };
    case "SET_PLAYING":
      return { ...state, isPlaying: action.playing };
    case "SET_CURRENT_TIME":
      return { ...state, currentTime: action.time };
    case "SET_DURATION":
      return { ...state, duration: action.duration };
    case "SET_TRACK_DURATION":
      return {
        ...state,
        trackDurations: {
          ...state.trackDurations,
          [action.index]: action.duration,
        },
      };
    case "LOAD_TRACK":
      return {
        ...state,
        trackIndex: action.index,
        currentTime: 0,
        duration: 0,
      };
  }
}

function getNextIndex(trackIndex: number, shuffle: boolean): number {
  if (shuffle) {
    let next = Math.floor(Math.random() * PLAYLIST.length);
    if (PLAYLIST.length > 1) {
      while (next === trackIndex)
        next = Math.floor(Math.random() * PLAYLIST.length);
    }
    return next;
  }
  return (trackIndex + 1) % PLAYLIST.length;
}

function getPrevIndex(trackIndex: number): number {
  return (trackIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// --- Component ---

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, dispatch] = useReducer(playerReducer, initialState);
  const stateRef = useRef(state);
  stateRef.current = state;

  const {
    isOpen,
    isPlaying,
    currentTime,
    duration,
    trackIndex,
    shuffle,
    showPlaylist,
    trackDurations,
  } = state;
  const currentTrack = PLAYLIST[trackIndex];

  // Preload durations for all tracks
  useEffect(() => {
    const tmpAudios: HTMLAudioElement[] = [];
    PLAYLIST.forEach((track, i) => {
      const tmp = new Audio();
      tmp.preload = "metadata";
      tmp.src = track.src;
      tmp.addEventListener("loadedmetadata", () => {
        if (Number.isFinite(tmp.duration)) {
          dispatch({
            type: "SET_TRACK_DURATION",
            index: i,
            duration: tmp.duration,
          });
        }
      });
      tmpAudios.push(tmp);
    });
    return () => {
      tmpAudios.forEach((a) => {
        a.src = "";
      });
    };
  }, []);

  // Audio element setup
  useEffect(() => {
    const audio = new Audio(PLAYLIST[0].src);
    audioRef.current = audio;

    audio.addEventListener("loadedmetadata", () =>
      dispatch({ type: "SET_DURATION", duration: audio.duration }),
    );
    audio.addEventListener("timeupdate", () =>
      dispatch({ type: "SET_CURRENT_TIME", time: audio.currentTime }),
    );

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  // Re-bind ended handler when trackIndex/shuffle changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onEnded = () => {
      const { trackIndex: idx, shuffle: shf } = stateRef.current;
      const next = getNextIndex(idx, shf);
      loadAndPlay(next, true);
    };

    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAndPlay = useCallback((index: number, autoPlay: boolean) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = PLAYLIST[index].src;
    audio.load();
    dispatch({ type: "LOAD_TRACK", index });

    if (autoPlay) {
      audio.play().then(() => dispatch({ type: "SET_PLAYING", playing: true }));
    } else {
      dispatch({ type: "SET_PLAYING", playing: false });
    }
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (stateRef.current.isPlaying) {
      audio.pause();
      dispatch({ type: "SET_PLAYING", playing: false });
    } else {
      audio.play().then(() => dispatch({ type: "SET_PLAYING", playing: true }));
    }
  }, []);

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const dur = stateRef.current.duration;
    if (!audio || !dur) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(
      0,
      Math.min(1, (e.clientX - rect.left) / rect.width),
    );
    audio.currentTime = ratio * dur;
  }, []);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const controlBtnClass =
    "neo-btn border-neo-border shadow-neo-sm text-neo-text flex size-9 cursor-pointer items-center justify-center rounded-xl border-3 bg-neo-bg transition-transform duration-100 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none";

  return (
    <div className="fixed top-12 right-5 z-[9998]" data-neo-window>
      {/* Floating button */}
      <div className="relative flex items-center justify-center">
        {isPlaying && (
          <>
            <span className="bg-neo-primary/40 border-neo-border/30 absolute size-12 animate-ping rounded-full border-2" />
            <span
              className="bg-neo-primary/20 absolute size-16 rounded-full"
              style={{
                animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              }}
            />
          </>
        )}
        <button
          onClick={() => dispatch({ type: "TOGGLE_OPEN" })}
          className={`neo-btn border-neo-border shadow-neo-md text-neo-text relative flex size-12 cursor-pointer items-center justify-center rounded-full border-3 transition-transform duration-100 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
            isPlaying ? "bg-neo-primary" : "bg-neo-surface"
          }`}
        >
          <Music
            className={`size-5 ${isPlaying ? "animate-bounce" : ""}`}
            style={isPlaying ? { animationDuration: "1.5s" } : undefined}
          />
        </button>
      </div>

      {isOpen && (
        <div className="bg-neo-surface border-neo-border shadow-neo-lg absolute top-16 right-0 w-[280px] rounded-2xl border-3">
          {/* Cover */}
          <div className="border-neo-border relative h-[200px] overflow-hidden rounded-t-2xl border-b-3">
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="size-full object-cover"
            />
          </div>

          <div className="p-4">
            {/* Track info */}
            <div className="mb-3 text-center">
              <p className="font-neo-heading text-neo-text m-0 truncate text-sm font-bold">
                {currentTrack.title}
              </p>
              <p className="m-0 text-xs font-medium text-gray-400">
                {currentTrack.artist}
              </p>
            </div>

            {/* Progress bar */}
            <div
              className="bg-neo-bg border-neo-border group mb-1.5 h-3 cursor-pointer overflow-hidden rounded-full border-2"
              onClick={handleSeek}
            >
              <div
                className="bg-neo-primary h-full rounded-full transition-[width] duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div
              className="font-neo text-neo-text mb-3 flex justify-between text-[11px] font-semibold"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => dispatch({ type: "TOGGLE_SHUFFLE" })}
                className={`${controlBtnClass} ${shuffle ? "!bg-neo-primary" : ""}`}
                title="Shuffle"
              >
                <Shuffle className="size-4" />
              </button>

              <button
                onClick={() => loadAndPlay(getPrevIndex(trackIndex), isPlaying)}
                className={controlBtnClass}
              >
                <SkipBack className="size-4" />
              </button>

              <button
                onClick={togglePlay}
                className="neo-btn bg-neo-primary border-neo-border shadow-neo-md text-neo-text flex size-10 cursor-pointer items-center justify-center rounded-xl border-3 transition-transform duration-100 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              >
                {isPlaying ? (
                  <Pause className="size-5" />
                ) : (
                  <Play className="ml-0.5 size-5" />
                )}
              </button>

              <button
                onClick={() =>
                  loadAndPlay(getNextIndex(trackIndex, shuffle), isPlaying)
                }
                className={controlBtnClass}
              >
                <SkipForward className="size-4" />
              </button>

              <button
                onClick={() => dispatch({ type: "TOGGLE_PLAYLIST" })}
                className={controlBtnClass}
                title="Playlist"
              >
                {showPlaylist ? (
                  <ChevronUp className="size-4" />
                ) : (
                  <ChevronDown className="size-4" />
                )}
              </button>
            </div>

            {/* Playlist */}
            {showPlaylist && (
              <div className="bg-neo-bg border-neo-border mt-3 overflow-hidden rounded-xl border-3">
                {PLAYLIST.map((track, i) => (
                  <button
                    key={track.src}
                    onClick={() => loadAndPlay(i, true)}
                    className={`flex w-full cursor-pointer items-center gap-2.5 px-3 py-2.5 text-left transition-colors ${
                      i === trackIndex
                        ? "bg-neo-primary/30 font-bold"
                        : "hover:bg-neo-primary/10"
                    } ${i > 0 ? "border-neo-border border-t-2" : ""}`}
                  >
                    <img
                      src={track.cover}
                      alt={track.title}
                      className="border-neo-border size-8 shrink-0 rounded-lg border-2 object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-neo text-neo-text m-0 truncate text-xs font-semibold">
                        {track.title}
                      </p>
                      <p className="m-0 truncate text-[10px] text-gray-400">
                        {track.artist}
                      </p>
                    </div>
                    <span
                      className="font-neo shrink-0 text-[10px] font-semibold text-gray-400"
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      {i === trackIndex && isPlaying
                        ? "♪"
                        : trackDurations[i] != null
                          ? formatTime(trackDurations[i])
                          : "--:--"}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
