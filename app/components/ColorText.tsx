"use client";

import { useColor } from "../providers/ColorProvider";

type ColorTextProps = {
  render: (color: string) => JSX.Element;
  originColor?: string;
};

export default function ColorText({
  render,
  originColor = "white",
}: ColorTextProps) {
  const { generateTextColor } = useColor();

  const color = generateTextColor(originColor);

  return <div>{render(color)}</div>;
}
