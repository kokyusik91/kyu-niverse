"use client";

import { useState } from "react";
import Image from "next/image";
import { SKILL } from "../constants/skillset";

type SkillDetails = {
  value: string;
  label: string;
  color: string;
  url: string;
};

export default function Skillset() {
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
      <h1 className="mb-3 text-center font-extrabold lg:text-xl xl:text-2xl 2xl:text-3xl">
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
              onMouseOver={() => handleMouseOver(item)}
              onMouseOut={handleMouseOut}
              className="mr-8 h-[50px] w-[50px]"
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
              onMouseOver={() => handleMouseOver(item)}
              onMouseOut={handleMouseOut}
              className="mr-8 h-[50px] w-[50px]"
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
