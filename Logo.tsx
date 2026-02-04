type LogoProps = {
  className?: string;
};

export default function Logo({
  className = "w-28 h-28",
}: LogoProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Breachless logo"
      className={`
        ${className}
        drop-shadow-[0_18px_40px_rgba(255,220,80,0.55)]
      `}
    >
      {/* Shield background */}
      <path
        d="M20 18 L100 18 V66 C100 88 60 106 60 106 C60 106 20 88 20 66 Z"
        fill="#FFD84D"
      />

      {/* Inner shield cut (creates space) */}
      <path
        d="M30 28 L90 28 V62 C90 78 60 92 60 92 C60 92 30 78 30 62 Z"
        fill="#111"
        opacity="0.9"
      />

      {/* Lock body */}
      <rect
        x="44"
        y="56"
        width="32"
        height="26"
        rx="6"
        fill="#FFD84D"
      />

      {/* Lock shackle (taller + spaced) */}
      <path
        d="M48 56 V48 C48 36 72 36 72 48 V56"
        stroke="#FFD84D"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* Keyhole */}
      <circle cx="60" cy="68" r="3.2" fill="#111" />
      <rect x="58.6" y="71" width="2.8" height="7" rx="1.4" fill="#111" />
    </svg>
  );
}
