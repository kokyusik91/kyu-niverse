"use client";

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

interface DescriptionContextType {
  hasDescription: boolean;
  toggleDescription: () => void;
}

const DescriptionContext = createContext<DescriptionContextType | undefined>(
  undefined,
);

type DescriptionProviderProps = {
  children: ReactNode;
};

export default function DescriptionProvider({
  children,
}: DescriptionProviderProps) {
  const [hasDescription, setHasDescription] = useState<boolean>(false);

  const toggleDescription = useCallback(() => {
    return setHasDescription((prev) => !prev);
  }, [setHasDescription]);

  return (
    <DescriptionContext.Provider value={{ hasDescription, toggleDescription }}>
      {children}
    </DescriptionContext.Provider>
  );
}

export function useDesciption() {
  const context = useContext(DescriptionContext);
  if (context === undefined) {
    throw new Error("useDescription must be used within a ColorProvider");
  }
  return context;
}
