export default function InstagramIcon({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="4"
        y="4"
        width="24"
        height="24"
        rx="6"
        fill="#FFFFFF"
        stroke="#1A1A2E"
        strokeWidth="2.5"
      />
      <circle
        cx="16"
        cy="16"
        r="6"
        fill="#8B5CF6"
        stroke="#1A1A2E"
        strokeWidth="2.5"
      />
      <circle cx="16" cy="16" r="2.5" fill="#FFFFFF" />
      <circle
        cx="23"
        cy="9"
        r="2"
        fill="#C4B5FD"
        stroke="#1A1A2E"
        strokeWidth="1.5"
      />
    </svg>
  );
}
