export default function PostItIcon({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Post-it note body */}
      <rect
        x="4"
        y="4"
        width="22"
        height="22"
        rx="1"
        fill="#FFE66D"
        stroke="#1A1A2E"
        strokeWidth="2.5"
      />
      {/* Folded corner */}
      <path
        d="M26 18L20 4H26V18Z"
        fill="#F5D03B"
        stroke="#1A1A2E"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Text lines */}
      <rect x="8" y="10" width="10" height="2" rx="0.5" fill="#1A1A2E" />
      <rect x="8" y="15" width="8" height="2" rx="0.5" fill="#1A1A2E" />
      <rect x="8" y="20" width="6" height="2" rx="0.5" fill="#1A1A2E" opacity="0.5" />
    </svg>
  );
}
