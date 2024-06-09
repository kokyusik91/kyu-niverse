import React, { useMemo, useState } from 'react';

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

  const amount = useMemo(() => data?.length, []);

  return (
    <ul className='mb-4 relative w-full h-[80px] z-90'>
      {data.map((man, index) => (
        <li
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
                }
              : {
                  zIndex: 10,
                  filter: 'none',
                  opacity: view ? 1 : 0,
                }
          }
          className='head-item'
        >
          {man}
        </li>
      ))}
      {view && (
        <button
          className='absolute top-2 left-10 z-10'
          onClick={handleClickPrev}
          disabled={activeIndex === 0}
        >
          {activeIndex === 0 ? '' : '⬅️'}
        </button>
      )}
      <button
        onClick={toggleView}
        className='absolute left-1/2 transform -translate-x-1/2 z-10'
      >
        {view ? '❌' : '👨🏼'}
      </button>
      {view && (
        <button
          className='absolute top-2 right-10 z-10'
          onClick={handleClickNext}
          disabled={amount === activeIndex + 1}
        >
          {amount === activeIndex + 1 ? '🙅🏼‍♀️' : '➡️'}
        </button>
      )}
    </ul>
  );
}
