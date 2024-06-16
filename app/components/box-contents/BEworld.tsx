'use client';

import { ReactNode } from 'react';
import { useColor } from '@/app/providers/ColorProvider';

type BEworldProps = {
  children: ReactNode;
};

export default function BEworld({ children }: BEworldProps) {
  const { generateColor } = useColor();

  return (
    <div
      className={`target grow h-full transition-all ${generateColor(
        'bg-violet-400'
      )}`}
    >
      {children}
    </div>
  );
}
