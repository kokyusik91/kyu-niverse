import { ReactNode } from "react";

type OriginalContentsProps = {
  children: ReactNode;
  isActive: boolean;
};

function OriginalContents({ children, isActive }: OriginalContentsProps) {
  return (
    <div
      className={`flex h-full w-full items-center justify-center ${
        isActive ? "z-20 opacity-90" : "z-30 opacity-100"
      }`}
    >
      {children}
    </div>
  );
}

export default OriginalContents;
