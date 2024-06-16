'use client';

import { useColor } from '@/app/providers/ColorProvider';
import { ReactNode } from 'react';

type InfraProps = {
  children: ReactNode;
};

export default function Infra({ children }: InfraProps) {
  const { generateColor } = useColor();

  return (
    <div
      className={`target grow transition-all ${generateColor('bg-sky-400')}`}
    >
      {children}
    </div>
  );
}
