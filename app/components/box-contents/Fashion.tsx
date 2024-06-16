'use client';

import { ReactNode } from 'react';
import { useColor } from '@/app/providers/ColorProvider';

type FashionProps = {
  children: ReactNode;
};

export default function Fashion({ children }: FashionProps) {
  const { generateColor } = useColor();
  return (
    <div
      className={`target w-1/2 h-full transition-all ${generateColor(
        'bg-purple-400 '
      )}`}
    >
      {children}
    </div>
  );
}
