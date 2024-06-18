"use client";

import { useEffect, useState } from "react";

const TARGET = 169;
const PERCENT = Math.floor((165 / 365) * 100);

export default function Health() {
  const [time, setTime] = useState(1);
  const [animationEnded, setAnimationEnded] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  // console.log("ww")

  useEffect(() => {
    if (time > TARGET) {
      setAnimationEnded(true);
      return;
    }

    const timer = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 15);

    return () => clearInterval(timer);
  }, [time]);

  const handleRetry = () => {
    setTime(1);
    setAnimationEnded(false);
    setAnimationKey((prev) => prev + 1);
  };

  return (
    <div className="relative flex gap-8">
      <div key={animationKey}>
        <h1 className="mb-3 animate-[2s_roundup_ease-in-out] text-3xl font-bold">
          헬스 💪🏻
        </h1>
        <div className="h-4 w-[300px] rounded-md bg-white">
          <div
            style={{ width: `${PERCENT}%` }}
            className={`h-4 rounded-md bg-white`}
          >
            <div
              className={`relative h-4 animate-[3s_graph_ease-in-out] rounded-md bg-blue-500`}
            >
              <time className="absolute right-0 top-full animate-[3s_wigglewiggle_ease-in-out] text-xl font-bold text-blue-500">
                {time}
              </time>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h1 className="text-3xl font-bold">클라이밍 🧗🏻‍♀️</h1>{" "}
        <div key={animationKey} className="flex justify-end">
          <time className="mr-1 inline-block animate-[2s_roundup_ease-in-out] bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 bg-clip-text text-4xl font-extrabold text-transparent">
            3
          </time>
          <h1 className="text-4xl font-bold">회</h1>
        </div>
      </div>

      <button
        onClick={handleRetry}
        className={`absolute right-1/2 top-[-12px] text-4xl transition-all ${
          animationEnded ? "opacity-1" : "opacity-0"
        }`}
      >
        ↩️
      </button>
    </div>
  );
}
