'use client';

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

interface ColorContextType {
  isColor: boolean;
  toggleColor: () => void;
  generateColor: (color: string) => string;
}

const ColorContext = createContext<ColorContextType | undefined>(undefined);

type ColorProviderProps = {
  children: ReactNode;
};

export default function ColorProvider({ children }: ColorProviderProps) {
  const [isColor, setIsColor] = useState<boolean>(false);

  const toggleColor = useCallback(() => {
    return setIsColor((prev) => !prev);
  }, [setIsColor]);

  const generateColor = useCallback(
    (color: string) => {
      if (!isColor) return 'bg-slate-200';

      return color;
    },
    [isColor]
  );

  return (
    <ColorContext.Provider value={{ isColor, toggleColor, generateColor }}>
      {children}
    </ColorContext.Provider>
  );
}

export function useColor() {
  const context = useContext(ColorContext);
  if (context === undefined) {
    throw new Error('useColor must be used within a ColorProvider');
  }
  return context;
}
