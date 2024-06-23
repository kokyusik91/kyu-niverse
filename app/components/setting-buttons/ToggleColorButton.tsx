"use client";

import { Moon, Paintbrush } from "lucide-react";
import { useColor } from "../../providers/ColorProvider";

export default function ToggleColorButton() {
  const { isColor, toggleColor } = useColor();

  return (
    <button
      onClick={toggleColor}
      className={`rounded-full p-3 text-3xl font-bold transition-all ease-in ${
        isColor
          ? "bg-white text-zinc-800"
          : "bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400"
      }`}
    >
      {isColor ? <Moon /> : <Paintbrush />}
    </button>
  );
}
