'use client';

import { ReactNode } from 'react';
import { useColor } from '@/app/providers/ColorProvider';

type FEWorldProps = {
  children: ReactNode;
};

export default function FEworld({ children }: FEWorldProps) {
  const { generateColor } = useColor();

  return (
    <div
      className={`target relative w-3/6 h-full transition-all ${generateColor(
        'bg-yellow-400'
      )}`}
    >
      {children}
    </div>
  );
}
