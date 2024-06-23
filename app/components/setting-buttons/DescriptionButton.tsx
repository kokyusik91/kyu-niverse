"use client";

import { Pencil, PencilOff } from "lucide-react";
import { useDesciption } from "@/app/providers/DescriptionProvider";

export default function DescriptionButton() {
  const { hasDescription, toggleDescription } = useDesciption();
  return (
    <>
      <button
        onClick={toggleDescription}
        className={`rounded-full bg-white p-3 text-4xl font-bold transition-all ease-in-out`}
      >
        {hasDescription ? (
          <PencilOff color="black" />
        ) : (
          <Pencil color="black" />
        )}
      </button>
      {/* 아이폰 토클 버튼 UI 프로젝트와 어울리지 않아 임시 주석 처리 */}
      {/* <label className="inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          value=""
          className="peer sr-only"
          onChange={toggleDescription}
        />
        <div className="peer relative h-7 w-14 rounded-full bg-gray-200 after:absolute after:start-[4px] after:top-0.5 after:h-6 after:w-6 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
      </label> */}
    </>
  );
}
