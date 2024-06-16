'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useColor } from '@/app/providers/ColorProvider';
import Link from 'next/link';
import { KOFETCH_NPM_URL } from '@/app/constants/external-url';

export default function Kofetch() {
  const { generateColor } = useColor();
  const [kofetch, setKofetch] = useState(false);

  const handleKofetch = () => {
    setKofetch(true);
  };

  const handleKofetch2 = () => {
    setKofetch(false);
  };

  return (
    <Link
      href={KOFETCH_NPM_URL}
      target='_blank'
      onMouseEnter={handleKofetch}
      onMouseLeave={handleKofetch2}
      className={`target h-2/6 transition-all ${generateColor('bg-teal-400')}`}
    >
      <div className='flex items-end'>
        <h1 className='text-3xl font-extrabold'>Ko</h1>
        <span
          className={`${
            kofetch ? 'translate-x-0' : 'translate-x-[300px] '
          } transition-all text-xl font-semibold  duration-1000 ease-in-out`}
        >
          Fetch
        </span>
      </div>
      <Image
        className='ml-2'
        src='/npm.webp'
        width={120}
        height={60}
        alt='앤피엠'
      />
    </Link>
  );
}
