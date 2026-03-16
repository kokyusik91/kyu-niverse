'use client';

import React, { useMemo, useState } from 'react';

const fakedata = [
  {
    title: '고질라-1',
    content: '웹표준, 접근성/크로스브라우징, 반응형 웹, SEO, SSR',
  },
  {
    title: '테일윈드-2',
    content:
      '사람이 원하는 요구사항을 어떠한 계속적으로 변하는 값, 즉 데이터의 형태로 만들어주는 것을 의미합니다.',
  },
  {
    title: '파라마라-3',
    content:
      'If you are using a static host like Nginx, you can configure rewrites from incoming requests to the correct files:',
  },
  {
    title: '스벨트-4',
    content: 'Authorization is the process of granting an integratio',
  },
  {
    title: '뷰제이에스-5',
    content:
      '론트엔드 개발자의 능력인 기획의 요구사항을 String, Array, Object와 같은 형태의 값으로 만들어내는 과정을 하는데 있어서',
  },
  {
    title: '리액트-6',
    content:
      'For example, the below query limits the response to entries where the "Task completed" checkbox property value is true:',
  },
  {
    title: '사마사마-7',
    content:
      'For example, the below query limits the response to entries where the "Task completed" checkbox property value is true:',
  },
];

type CardData = {
  title: string;
  content: string;
};

function Card({
  card,
  distanceFromActiveIndex,
}: {
  card: CardData;
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
      <h1>{card.title} 🧐</h1>
      <p>{card.content}</p>
      {/* <img className='w-full h-full' src={card.content} alt={card.title} /> */}
    </div>
  );
}

export function BasicCardSlider() {
  const [activeIndex, setActiveIndex] = useState(3);

  const distanceFromActiveIndex = (currentIndex: number) => {
    return currentIndex - activeIndex;
  };

  const amount = useMemo(() => fakedata?.length, []);

  const handlePrevButton = () => {
    setActiveIndex((prev) => prev - 1);
  };

  const handleNextButton = () => {
    setActiveIndex((prev) => prev + 1);
  };

  return (
    <div className='slider'>
      {fakedata?.map((item, index) => (
        <Card
          key={index}
          card={item}
          distanceFromActiveIndex={distanceFromActiveIndex(index)}
        />
      ))}
      <button
        onClick={handlePrevButton}
        className={`${activeIndex === 0 ? 'text-blue-300' : 'text-blue-700'}`}
        id='prev'
        disabled={activeIndex === 0}
      >
        prev
      </button>
      <button
        onClick={handleNextButton}
        className={`${
          amount === activeIndex + 1 ? 'text-blue-300' : 'text-blue-700'
        }`}
        id='next'
        disabled={amount === activeIndex + 1}
      >
        next
      </button>
    </div>
  );
}
