'use client';

import { useColor } from '@/app/providers/ColorProvider';
import { ReactNode } from 'react';

type MedicProps = {
  children: ReactNode;
};

export default function Medic({ children }: MedicProps) {
  const { generateColor } = useColor();
  return (
    <div
      className={`target grow transition-all ${generateColor('bg-rose-400')}`}
    >
      {children}
    </div>
  );
}
