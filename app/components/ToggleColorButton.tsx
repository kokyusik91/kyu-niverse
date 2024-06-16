'use client';

import { useColor } from '../providers/ColorProvider';

export default function ToggleColorButton() {
  const { isColor, toggleColor } = useColor();

  return (
    <button
      onClick={toggleColor}
      className={`mb-3 p-5 text-xl rounded-lg font-bold transition-all ease-in-out ${
        isColor ? 'bg-red-500 text-zinc-200' : 'bg-white text-zinc-800'
      }`}
    >
      {isColor ? '컬러로' : '모노로'}
    </button>
  );
}
