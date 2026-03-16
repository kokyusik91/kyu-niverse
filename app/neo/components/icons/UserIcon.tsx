export default function UserIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="12" r="5" fill="#C4B5FD" stroke="#1A1A2E" strokeWidth="2" />
      <path d="M6 28C6 22.477 10.477 18 16 18C21.523 18 26 22.477 26 28" stroke="#1A1A2E" strokeWidth="2" strokeLinecap="round" fill="#C4B5FD" />
    </svg>
  );
}
