'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

function Card({
  card,
  distanceFromActiveIndex,
}: {
  // card: CardData;
  card: CardBook;
  distanceFromActiveIndex: number;
}) {
  return (
    <div
      style={
        distanceFromActiveIndex !== 0
          ? {
              transform: `translateX(${
                120 * distanceFromActiveIndex
              }px) scale(${
                1 - 0.2 * Math.abs(distanceFromActiveIndex)
              }) perspective(16px) rotateY(${
                distanceFromActiveIndex > 0 ? '-1deg' : '1deg'
              })`,
              filter: 'blur(5px)',
              zIndex: `${500 - Math.abs(distanceFromActiveIndex)}`,
              opacity: `${Math.abs(distanceFromActiveIndex) > 2 ? 0 : 0.6}`,
            }
          : {
              transform: 'none',
              zIndex: 500,
              filter: 'none',
              opacity: 1,
            }
      }
      className='slider-item'
    >
      <Link href={card.link} target='_blank'>
        <Image fill src={card.imageUrl} alt={card.id} />
      </Link>
    </div>
  );
}

type CardBook = {
  id: string;
  link: string;
  imageUrl: string;
};

type SmallCardSliderProps = {
  data: CardBook[];
};

export function SmallCardSlider({ data }: SmallCardSliderProps) {
  const [activeIndex, setActiveIndex] = useState(3);

  const distanceFromActiveIndex = (currentIndex: number) => {
    return currentIndex - activeIndex;
  };

  const amount = useMemo(() => data?.length, [data]);

  const handlePrevButton = () => {
    setActiveIndex((prev) => prev - 1);
  };

  const handleNextButton = () => {
    setActiveIndex((prev) => prev + 1);
  };

  return (
    <div className='slider'>
      {data?.map((item, index) => (
        <Card
          key={item.id}
          card={item}
          distanceFromActiveIndex={distanceFromActiveIndex(index)}
        />
      ))}
      <button
        onClick={handlePrevButton}
        className={`${
          activeIndex === 0
            ? 'text-blue-100 bg-slate-500 opacity-50'
            : 'text-blue-100 bg-blue-500'
        } transition-all`}
        id='prev'
        disabled={activeIndex === 0}
      >
        {activeIndex === 0 ? '🙅🏼‍♂️' : '⬅️'}
      </button>
      <button
        onClick={handleNextButton}
        className={`${
          amount === activeIndex + 1
            ? 'text-blue-100 bg-slate-500 opacity-50'
            : 'text-blue-100 bg-blue-500'
        }`}
        id='next'
        disabled={amount === activeIndex + 1}
      >
        {amount === activeIndex + 1 ? '🙅🏼‍♀️' : '➡️'}
      </button>
    </div>
  );
}
