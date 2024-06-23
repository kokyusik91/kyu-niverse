"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useMemo, useState } from "react";

export default function HeadSlider({ data }: { data: string[] }) {
  const [activeIndex, setActiveIndex] = useState(5);
  const [view, setView] = useState(true);

  const distanceFromActiveIndex = (currentIndex: number) => {
    return currentIndex - activeIndex;
  };

  const handleClickNext = () => {
    setActiveIndex((prev) => prev + 1);
  };

  const handleClickPrev = () => {
    setActiveIndex((prev) => prev - 1);
  };

  const toggleView = () => {
    setView((prev) => !prev);
  };

  const amount = useMemo(() => data?.length, [data?.length]);

  const changeStyle = (index: number) =>
    distanceFromActiveIndex(index) !== 0
      ? {
          transform: `translateX(${distanceFromActiveIndex(index) * 100}%)`,
          filter: "blur(1px)",
          zIndex: `${10 - Math.abs(distanceFromActiveIndex(index))}`,
          opacity: 0,
        }
      : {
          zIndex: 10,
          filter: "none",
          opacity: view ? 1 : 0,
        };

  return (
    <ul className="h-1/10 relative flex w-full items-center">
      {data.map((man, index) => (
        <li
          className="absolute left-1/2 -translate-x-1/2 transform text-justify text-7xl transition-all duration-500"
          key={index}
          style={changeStyle(index)}
        >
          {man}
        </li>
      ))}
      {/* 좌측 버튼 */}
      {view && activeIndex !== 0 && (
        <button className="absolute left-10 z-10" onClick={handleClickPrev}>
          <ChevronLeft size={20} color="black" />
        </button>
      )}
      {/* 우측 버튼 */}
      {view && amount !== activeIndex + 1 && (
        <button className="absolute right-10 z-10" onClick={handleClickNext}>
          <ChevronRight size={20} color="black" />
        </button>
      )}
      <button
        onClick={toggleView}
        className="absolute left-1/2 z-10 -translate-x-1/2 -translate-y-[50px] transform"
      >
        {view ? "❌" : "👨🏼"}
      </button>
    </ul>
  );
}
