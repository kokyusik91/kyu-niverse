"use client";

import { useState } from "react";
import Image from "next/image";
import { SKILL } from "@/app/constants/skillset";
import { useColor } from "@/app/old/providers/ColorProvider";

type SkillDetails = {
  value: string;
  label: string;
  color: string;
  url: string;
};

// TODO: 현재 무한 롤링배너가 되어야하는데, 무한으로 이어지지 않고 한번 끊키는 현상 발견 => 원인 파악후 교체
export default function Skillset() {
  const { generateTextColor } = useColor();
  const [target, setTarget] = useState<SkillDetails | null>(null);
  const [isToggled, setToggled] = useState(false);

  const handleMouseOver = (item: SkillDetails) => {
    setToggled(true);
    setTarget(item);
  };

  const handleMouseOut = () => {
    setToggled(false);
    setTarget(null);
  };

  return (
    <div className="">
      <h1
        className={`mb-3 text-center text-2xl font-extrabold lg:text-3xl ${generateTextColor("white")}`}
      >
        I LOVE 😘
      </h1>
      <p
        className={`mb-7 h-10 ${
          target?.color
        } bg-clip-text text-center text-4xl font-extrabold text-transparent transition-all duration-300 ease-in-out ${
          isToggled ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        }`}
      >
        {target?.label}
      </p>
      <div className="flex">
        <ul className="flex animate-[120s_rollingleft1_linear_infinite] items-center">
          {[...SKILL, ...SKILL].map((item, index) => (
            <li
              key={index}
              onClick={() => handleMouseOver(item)}
              onMouseOver={() => handleMouseOver(item)}
              onMouseOut={handleMouseOut}
              className="mr-4 h-[50px] w-[50px]"
            >
              <Image
                width={50}
                height={50}
                objectFit=""
                src={item.url}
                alt={item.label}
              />
            </li>
          ))}
        </ul>
        <ul className="flex animate-[120s_rollingleft2_linear_infinite] items-center">
          {[...SKILL, ...SKILL].map((item, index) => (
            <li
              key={index}
              onClick={() => handleMouseOver(item)}
              onMouseOver={() => handleMouseOver(item)}
              onMouseOut={handleMouseOut}
              className="mr-4 h-[50px] w-[50px]"
            >
              <Image
                width={50}
                height={50}
                objectFit=""
                src={item.url}
                alt={item.label}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
