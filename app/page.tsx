"use client";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [mono, setMono] = useState(true);

  const toggleColor = () => {
    setMono((prev) => !prev);
  };

  const toggleMonoColor = (color: string) => {
    if (mono) return "bg-slate-200";

    return color;
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button
        onClick={toggleColor}
        className={
          mono
            ? "p-5 text-xl mb-3 rounded-lg bg-red-500 text-zinc-200 font-bold transition-all"
            : "p-5 text-xl mb-3 rounded-lg bg-white text-zinc-800 font-bold transition-all"
        }
      >
        {mono ? "컬러로" : "모노로"}
      </button>
      <div className="w-full p-5 bg-white">
        <div className="w-full h-[1000px] flex bg-white gap-5">
          <div className="w-2/6 h-full flex flex-col bg-white gap-5">
            <div className="w-full flex grow gap-5">
              <div className="w-1/2 h-full flex flex-col bg-white gap-5">
                <div
                  className={`target h-1/4  transition-all ${toggleMonoColor(
                    "bg-yellow-400"
                  )}`}
                ></div>
                <div
                  className={`target grow transition-all ${toggleMonoColor(
                    "bg-slate-800"
                  )} `}
                ></div>
                <div
                  className={`target h-1/4 transition-all ${toggleMonoColor(
                    "bg-slate-400"
                  )}`}
                ></div>
              </div>
              <div
                className={`target w-1/2 h-full transition-all ${toggleMonoColor(
                  "bg-purple-400"
                )}`}
              ></div>
            </div>
            <div
              className={`target h-2/6 transition-all ${toggleMonoColor(
                "bg-blue-400"
              )}`}
            ></div>
          </div>
          <div className="flex flex-col grow bg-white gap-5">
            <div className="flex grow bg-white gap-5">
              <div
                className={`target grow transition-all ${toggleMonoColor(
                  "bg-rose-400"
                )}`}
              >
                <Image
                  src={"/scv.webp"}
                  width={119}
                  height={160}
                  alt="starcraft scv"
                />
                <h1 className="absolute text-[100px] text-zinc-800 font-bold">
                  scv
                </h1>
              </div>
              <div
                className={`target w-1/2 transition-all ${toggleMonoColor(
                  "bg-emerald-300"
                )}`}
              ></div>
              <div className="flex flex-col grow bg-white gap-5">
                <div
                  className={`target grow transition-all ${toggleMonoColor(
                    "bg-sky-400"
                  )}`}
                ></div>
                <div
                  className={`target h-2/6 transition-all ${toggleMonoColor(
                    "bg-teal-400"
                  )}`}
                ></div>
              </div>
            </div>
            <div className="flex h-2/5 bg-white gap-5">
              <div
                className={`target w-3/6 h-full transition-all ${toggleMonoColor(
                  "bg-yellow-400"
                )}`}
              ></div>
              <div
                className={`target grow h-full transition-all ${toggleMonoColor(
                  "bg-violet-400"
                )}`}
              ></div>
              <div
                className={`target grow h-full transition-all ${toggleMonoColor(
                  "bg-zinc-400"
                )}`}
              ></div>
            </div>
            <div className="flex grow bg-white gap-5">
              <div
                className={`target grow transition-all ${toggleMonoColor(
                  "bg-fuchsia-400"
                )}`}
              ></div>
              <div
                className={`target w-1/2 transition-all ${toggleMonoColor(
                  "bg-lime-400"
                )}`}
              ></div>
              <div
                className={`target grow transition-all ${toggleMonoColor(
                  "bg-sky-400"
                )}`}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
