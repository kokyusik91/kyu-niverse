'use client';

import { ReactNode } from 'react';

type MedicProps = {
  children: ReactNode;
};

export default function Medic({ children }: MedicProps) {
  return (
    <div
      className={`target grow transition-all bg-[url('/code.jpg')] bg-right-top	`}
    >
      {children}
    </div>
  );
}
