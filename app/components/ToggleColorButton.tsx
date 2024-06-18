'use client';

import { useColor } from '../providers/ColorProvider';

export default function ToggleColorButton() {
  const { isColor, toggleColor } = useColor();

  return (
    <button
      onClick={toggleColor}
      className={`mb-3 p-2 text-4xl rounded-full font-bold transition-all ease-in-out ${
        isColor ? 'bg-white text-zinc-800' : 'bg-gradient-to-r from-blue-600  via-green-500  to-indigo-400  inline-block' 
      }`}
    >
      {isColor ? '⚪️' : '🎨'}
    </button>
  );
}

