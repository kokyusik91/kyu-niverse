'use client';

import { useEffect, useState } from 'react';

const TARGET = 165;
const PERCENT = Math.floor((165 / 365) * 100);
export default function Health() {
  const [time, setTime] = useState(1);
  const [animationEnded, setAnimationEnded] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

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
    <div className='relative flex gap-8'>
      <div key={animationKey}>
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
        <div key={animationKey} className='flex justify-end'>
          <time className='mr-1 text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text animate-[2s_roundup_ease-in-out]'>
            3
          </time>
          <h1 className='text-4xl font-bold'>회</h1>
        </div>
      </div>

      <button
        onClick={handleRetry}
        className={`absolute text-4xl top-[-12px] right-1/2 transition-all ${
          animationEnded ? 'opacity-1' : 'opacity-0'
        }`}
      >
        ↩️
      </button>
    </div>
  );
}
