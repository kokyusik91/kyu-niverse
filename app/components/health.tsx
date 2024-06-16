'use client';

import { useEffect, useState } from 'react';

const TARGET = 165;
const PERCENT = Math.floor((165 / 365) * 100);
export default function Health() {
  const [time, setTime] = useState(1);
  const [animate, setAnimate] = useState(false);

  const resetAnimation = () => {
    setTime(1);
    setAnimate(!animate); // 애니메이션을 다시 시작하도록 상태 변경
  };

  useEffect(() => {
    if (time > TARGET) return;

    const timer = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 15);

    return () => clearInterval(timer);
  }, [time, animate]);

  return (
    <div className='flex gap-8'>
      <div>
        <h1 className='text-3xl font-bold mb-3 animate-[2s_roundup_ease-in-out]'>
          헬스 💪🏻
        </h1>
        <div className='w-[300px] h-4 bg-white rounded-md'>
          <div
            style={{ width: `${PERCENT}%` }}
            className={`h-4 bg-white rounded-md`}
          >
            <div
              className={`relative animate-[3s_graph_ease-in-out] h-4 bg-blue-500 rounded-md`}
            >
              <time className='absolute top-full font-bold text-xl text-blue-500 right-0 animate-[3s_wigglewiggle_ease-in-out]'>
                {time}
              </time>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h1 className='text-3xl font-bold'>클라이밍 🧗🏻‍♀️</h1>{' '}
        <div className='flex justify-end'>
          <time className='mr-1 text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text animate-[2s_roundup_ease-in-out]'>
            3
          </time>
          {'  '}
          <h1 className='text-4xl font-bold'>회</h1>
        </div>
      </div>
    </div>
  );
}
