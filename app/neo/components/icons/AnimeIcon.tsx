export default function AnimeIcon({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Film frame */}
      <rect
        x="4"
        y="6"
        width="24"
        height="20"
        rx="3"
        fill="#FFFFFF"
        stroke="#1A1A2E"
        strokeWidth="2.5"
      />
      {/* Film perforations left */}
      <rect x="6" y="9" width="3" height="3" rx="0.5" fill="#1A1A2E" />
      <rect x="6" y="20" width="3" height="3" rx="0.5" fill="#1A1A2E" />
      {/* Film perforations right */}
      <rect x="23" y="9" width="3" height="3" rx="0.5" fill="#1A1A2E" />
      <rect x="23" y="20" width="3" height="3" rx="0.5" fill="#1A1A2E" />
      {/* Play triangle */}
      <path d="M14 12L14 20L21 16Z" fill="#FF6B6B" stroke="#1A1A2E" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
