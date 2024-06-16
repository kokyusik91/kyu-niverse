'use client';

import Image from 'next/image';
import React, { useMemo, useState } from 'react';

export default function ImageSlider({
  data,
  height,
  width,
}: {
  data: string[];
  height: number;
  width: number;
}) {
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

  const amount = useMemo(() => data?.length, []);

  return (
    <ul className={`relative w-full h-[170px] z-50`}>
      {data.map((man, index) => (
        <Image
          src={man}
          alt={man}
          width={400}
          height={200}
          key={index}
          style={
            distanceFromActiveIndex(index) !== 0
              ? {
                  transform: `translateX(${
                    distanceFromActiveIndex(index) * 100
                  }%)`,
                  filter: 'blur(1px)',
                  zIndex: `${10 - Math.abs(distanceFromActiveIndex(index))}`,
                  opacity: 0,
                  width: '350px',
                }
              : {
                  zIndex: 10,
                  filter: 'none',
                  opacity: 1,
                  width: '350px',
                }
          }
          className='clothes-item'
        />
      ))}
      <button
        className='absolute top-28 left-2 z-10'
        onClick={handleClickPrev}
        disabled={activeIndex === 0}
      >
        {activeIndex === 0 ? '' : '⬅️'}
      </button>
      <button
        className='absolute top-28 right-2 z-10'
        onClick={handleClickNext}
        disabled={amount === activeIndex + 1}
      >
        {amount === activeIndex + 1 ? '🙅🏼‍♀️' : '➡️'}
      </button>
    </ul>
  );
}
