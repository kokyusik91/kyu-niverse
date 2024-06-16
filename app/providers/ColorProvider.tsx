'use client';

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

// Context 타입 정의
interface ColorContextType {
  isColor: boolean;
  toggleColor: () => void;
  generateColor: (color: string) => string;
}

// Context 생성
const ColorContext = createContext<ColorContextType | undefined>(undefined);

type ColorProviderProps = {
  children: ReactNode;
};

export default function ColorProvider({ children }: ColorProviderProps) {
  const [isColor, setIsColor] = useState<boolean>(false);

  const toggleColor = useCallback(() => {
    return setIsColor((prev) => !prev);
  }, [isColor, setIsColor]);

  const generateColor = useCallback(
    (color: string) => {
      if (!isColor) return 'bg-slate-200';

      return color;
    },
    [isColor, setIsColor]
  );

  return (
    <ColorContext.Provider value={{ isColor, toggleColor, generateColor }}>
      {children}
    </ColorContext.Provider>
  );
}

// Custom Hook
export function useColor() {
  const context = useContext(ColorContext);
  if (context === undefined) {
    throw new Error('useColor must be used within a ColorProvider');
  }
  return context;
}
