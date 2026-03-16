"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import React, { useMemo, useState } from "react";

export default function PantsSlider({ data }: { data: string[] }) {
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
    // 버튼들이 딸려와야하기 때문에 relative 붙어야함.
    <ul className={`h-6/10 relative z-10 flex w-full items-center`}>
      {data.map((man, index) => (
        <Image
          src={man}
          alt={man}
          width={200}
          height={200}
          key={index}
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
                  width: "200px",
                }
              : {
                  zIndex: 10,
                  filter: "none",
                  opacity: 1,
                  width: "200px",
                }
          }
        />
      ))}
      {/* 버튼 영역 */}
      {activeIndex !== 0 && (
        <button
          className="absolute left-2 top-28 z-10"
          onClick={handleClickPrev}
          disabled={activeIndex === 0}
        >
          <ChevronLeft size={20} color="black" />
        </button>
      )}
      {/* 버튼 영역 */}
      {amount !== activeIndex + 1 && (
        <button
          className="absolute right-2 top-28 z-10"
          onClick={handleClickNext}
          disabled={amount === activeIndex + 1}
        >
          <ChevronRight size={20} color="black" />
        </button>
      )}
      <div className="absolute bottom-0 flex w-full translate-y-8 transform justify-center gap-7">
        <Image src="/j-l.png" alt="자운드 왼쪽" width={100} height={100} />
        <Image src="/j-r.png" alt="자운드 오른쪽" width={100} height={100} />
      </div>
    </ul>
  );
}
