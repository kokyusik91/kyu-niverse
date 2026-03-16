"use client";

import React from "react";
import { KKS } from "@/app/constants/interest";
import Interest from "../box-contents/Interest";
import ColorText from "../ColorText";

export default function InterestContainer() {
  return (
    <Interest>
      <h1>
        <ColorText
          render={(color) => (
            <span className={`text-2xl font-extrabold 2xl:text-3xl ${color}`}>
              큐식코는
            </span>
          )}
        />
        <br />
        <div className="flex items-center">
          <div className="m-auto h-[48px] overflow-hidden">
            <ul className="textbox">
              {KKS.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center justify-end bg-gradient-to-t from-red-300 to-indigo-700 bg-clip-text text-[32px] font-extrabold text-transparent"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <ColorText
            render={(color) => (
              <span className={`text-2xl font-extrabold 2xl:text-3xl ${color}`}>
                을 좋아합니다.
              </span>
            )}
          />
        </div>
      </h1>
    </Interest>
  );
}
