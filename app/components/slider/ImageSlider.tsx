"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import React, { useMemo, useState } from "react";

export default function ImageSlider({ data }: { data: string[] }) {
  const [activeIndex, setActiveIndex] = useState(2);

  const distanceFromActiveIndex = (currentIndex: number) => {
    return currentIndex - activeIndex;
  };

  const handleClickNext = () => {
    setActiveIndex((prev) => prev + 1);
  };

  const handleClickPrev = () => {
    setActiveIndex((prev) => prev - 1);
  };

  const amount = useMemo(() => data?.length, [data?.length]);

  return (
    <ul className={`h-3/10 relative top-10 z-20 flex w-full items-center`}>
      {data.map((man, index) => (
        <Image
          key={index}
          src={man}
          alt={man}
          width={270}
          height={300}
          className="absolute left-1/2 -translate-x-1/2 transform text-justify transition duration-500"
          style={
            distanceFromActiveIndex(index) !== 0
              ? {
                  transform: `translateX(${
                    distanceFromActiveIndex(index) * 100
                  }%)`,
                  filter: "blur(1px)",
                  zIndex: `${10 - Math.abs(distanceFromActiveIndex(index))}`,
                  opacity: 0,
                }
              : {
                  zIndex: 10,
                  filter: "none",
                  opacity: 1,
                }
          }
        />
      ))}
      {/* 좌측 버튼 */}
      {activeIndex !== 0 && (
        <button
          className="absolute left-2 top-28 z-10"
          onClick={handleClickPrev}
        >
          <ChevronLeft size={20} color="black" />
        </button>
      )}
      {/* 우측 버튼 */}
      {amount !== activeIndex + 1 && (
        <button
          className="absolute right-2 top-28 z-10"
          onClick={handleClickNext}
          disabled={amount === activeIndex + 1}
        >
          <ChevronRight size={20} color="black" />
        </button>
      )}
    </ul>
  );
}
