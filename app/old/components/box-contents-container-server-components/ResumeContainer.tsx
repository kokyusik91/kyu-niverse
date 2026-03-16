"use client";

import ColorText from "../ColorText";
import Resume from "../box-contents/Resume";

// TODO: 서버 컴포넌트로 바꿀수 있는 방향 찾아야함. render props는 안됨
export default function ResumeContainer() {
  return (
    <Resume>
      <ColorText
        render={(color) => (
          <span className={`relative mr-2 text-3xl font-bold ${color}`}>
            RESUME
          </span>
        )}
      />
      <span className="animate-[3s_roundup_ease-in-out_infinite_alternate-reverse] text-3xl">
        💾
      </span>
    </Resume>
  );
}
