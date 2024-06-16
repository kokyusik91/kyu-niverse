'use client';

import { ReactNode } from 'react';
import { useColor } from '@/app/providers/ColorProvider';

type InterestProps = {
  children: ReactNode;
};

export default function Interest({ children }: InterestProps) {
  const { generateColor } = useColor();

  return (
    <div
      className={`target h-2/6 transition-all ${generateColor('bg-blue-400')}`}
    >
      {children}
    </div>
  );
}
