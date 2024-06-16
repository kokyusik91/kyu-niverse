'use client';

import React, { ReactNode } from 'react';
import { useColor } from '@/app/providers/ColorProvider';

type BookStoreProps = {
  children: ReactNode;
};

export default function BookStore({ children }: BookStoreProps) {
  const { generateColor } = useColor();

  return (
    <div
      className={`target w-1/2 transition-all ${generateColor(
        'bg-gradient-to-r  from-indigo-400 to-red-300'
      )}`}
    >
      {children}
    </div>
  );
}
