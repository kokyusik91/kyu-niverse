import { ReactNode } from "react";

type DescriptionContentsProps = {
  children: ReactNode;
  isActive: boolean;
};

export default function DescriptionContents({
  children,
  isActive,
}: DescriptionContentsProps) {
  return (
    <div
      className={`absolute h-full w-full flex-col bg-zinc-400 p-5 transition-all ${
        isActive ? "z-30 opacity-90" : "z-20 opacity-0"
      }`}
    >
      {children}
    </div>
  );
}
