'use client';

import { BRUNCH_URL } from '@/app/constants/external-url';
import { useColor } from '@/app/providers/ColorProvider';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

export default function Brunch() {
  const { generateColor } = useColor();
  const [brunch, setBrunch] = useState(false);

  const handleBrunch = () => {
    setBrunch(true);
  };
  const handleBrunch2 = () => {
    setBrunch(false);
  };

  return (
    <Link
      href={BRUNCH_URL}
      target='_blank'
      onMouseEnter={handleBrunch}
      onMouseLeave={handleBrunch2}
      className={`relative target flex flex-col grow transition-all ${generateColor(
        'bg-sky-400'
      )}`}
    >
      <Image
        className={`mb-3 transition-all duration-1000 z-50 ${
          brunch ? 'translate-x-0' : 'translate-x-[-1000px]'
        } ${brunch ? 'rotate-0' : 'rotate-180'} ${
          brunch ? 'opacity-1' : 'opacity-0'
        }`}
        src={'/brunch.svg'}
        width={119}
        height={160}
        alt='brunch logo'
      />
      <h1
        className={`transition-all duration-1000 text-lg font-bold ${
          brunch ? 'translate-x-0' : 'translate-x-[200px]'
        } ${brunch ? 'rotate-0' : 'rotate-180'}`}
      >
        Brunch
      </h1>
      <h1
        className={`${
          brunch ? 'opacity-0' : 'opacity-1'
        } transition-all text-5xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/3 `}
      >
        ✍️
      </h1>
    </Link>
  );
}
