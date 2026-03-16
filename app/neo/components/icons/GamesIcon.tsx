export default function GamesIcon({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="3"
        y="8"
        width="26"
        height="16"
        rx="8"
        fill="#FFFFFF"
        stroke="#1A1A2E"
        strokeWidth="2.5"
      />
      <rect x="9" y="12" width="3" height="9" rx="1" fill="#1A1A2E" />
      <rect x="6" y="15" width="9" height="3" rx="1" fill="#1A1A2E" />
      <circle
        cx="22"
        cy="13"
        r="2"
        fill="#FF922B"
        stroke="#1A1A2E"
        strokeWidth="1.5"
      />
      <circle
        cx="22"
        cy="19"
        r="2"
        fill="#4ECDC4"
        stroke="#1A1A2E"
        strokeWidth="1.5"
      />
    </svg>
  );
}
