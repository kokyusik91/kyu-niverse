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
      className={`relative target w-1/2 transition-all ${generateColor(
        'bg-gradient-to-r  from-blue-400  to-green-200'
      )}`}
    >
      {children}
    </div>
  );
}
