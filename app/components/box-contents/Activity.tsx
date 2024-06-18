'use client';

import { useColor } from '@/app/providers/ColorProvider';
import Health from '../Health';
import { ReactNode } from 'react';

type ActivityProps = {
  children: ReactNode;
};

export default function Activity({ children }: ActivityProps) {
  const { generateColor } = useColor();

  return (
    <div
      className={`target w-1/2 transition-all ${generateColor(
        'bg-gradient-to-r  from-green-200 to-indigo-300'
      )}`}
    >
      {children}
    </div>
  );
}
