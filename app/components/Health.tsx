"use client";

import { useEffect, useState } from "react";
import { useColor } from "../providers/ColorProvider";
import { Repeat1 } from "lucide-react";

const TARGET = 169;
const PERCENT = Math.floor((165 / 365) * 100);

export default function Health() {
  const { isColor, generateTextColor } = useColor();
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
    <div className="relative flex w-full justify-center">
      <div key={animationKey}>
        <h1
          className={`mb-3 animate-[2s_roundup_ease-in-out] font-bold xl:text-xl 2xl:text-3xl ${generateTextColor("white")}`}
        >
          헬스 💪🏻
        </h1>
        <div
          className={`h-4 w-[250px] rounded-md ${isColor ? "bg-white" : "bg-zinc-300"}`}
        >
          <div
            style={{ width: `${PERCENT}%` }}
            className={`h-4 rounded-md ${isColor ? "bg-white" : "bg-zinc-300"}`}
          >
            <div
              className={`relative h-4 animate-[3s_graph_ease-in-out] rounded-md bg-blue-500`}
            >
              <time className="lg:text-md absolute right-0 top-full animate-[3s_wigglewiggle_ease-in-out] font-bold text-blue-500 xl:text-xl 2xl:text-3xl">
                {time}
              </time>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h1
          className={`text-nowrap font-bold xl:text-xl 2xl:text-3xl ${generateTextColor("white")}`}
        >
          클라이밍 🧗🏻‍♀️
        </h1>
        <div key={animationKey} className="flex justify-end">
          <time className="mr-1 inline-block animate-[2s_roundup_ease-in-out] bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 bg-clip-text font-extrabold text-transparent xl:text-xl 2xl:text-3xl">
            3
          </time>
          <h1
            className={`font-bold xl:text-xl 2xl:text-3xl ${generateTextColor("white")}`}
          >
            회
          </h1>
        </div>
      </div>

      <button
        onClick={handleRetry}
        className={`absolute right-1/2 top-[-12px] translate-x-1/2 transform rounded-full bg-green-300 p-2 transition-all ${
          animationEnded ? "opacity-1" : "opacity-0"
        }`}
      >
        <Repeat1 size={20} />
      </button>
    </div>
  );
}
