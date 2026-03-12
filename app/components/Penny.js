"use client";

/**
 * Penny — the WePickUpThePhone mascot.
 * Minimalist flat illustration of a professional receptionist with headset.
 * Poses: waving (default), talking, thumbsUp, thinking
 */
export default function Penny({ pose = "waving", className = "", size = 200 }) {
  const skinTone = "#F2C4A0";
  const skinShadow = "#E5A97A";
  const hair = "#2D1B12";
  const teal = "#0D9488";
  const tealDark = "#0F766E";
  const shirt = "#0D9488";
  const headset = "#374151";

  return (
    <svg
      viewBox="0 0 200 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size * 1.3}
      aria-label="Penny, the AI receptionist mascot"
    >
      {/* Body / Shirt */}
      <ellipse cx="100" cy="230" rx="55" ry="30" fill={shirt} />
      <rect x="70" y="170" width="60" height="65" rx="8" fill={shirt} />

      {/* Neck */}
      <rect x="90" y="155" width="20" height="25" rx="4" fill={skinTone} />

      {/* Head */}
      <ellipse cx="100" cy="110" rx="42" ry="50" fill={skinTone} />

      {/* Hair — back volume */}
      <ellipse cx="100" cy="80" rx="46" ry="42" fill={hair} />
      {/* Hair — front bangs */}
      <path d="M58 90 C60 60, 82 48, 100 48 C118 48, 140 60, 142 90 C142 80, 130 55, 100 50 C70 55, 58 80, 58 90Z" fill={hair} />
      {/* Hair — sides */}
      <ellipse cx="60" cy="110" rx="8" ry="20" fill={hair} />
      <ellipse cx="140" cy="110" rx="8" ry="20" fill={hair} />

      {/* Face — eyes */}
      <ellipse cx="84" cy="112" rx="4" ry="4.5" fill="#2D1B12" />
      <ellipse cx="116" cy="112" rx="4" ry="4.5" fill="#2D1B12" />
      {/* Eye highlights */}
      <circle cx="85.5" cy="110.5" r="1.5" fill="white" />
      <circle cx="117.5" cy="110.5" r="1.5" fill="white" />

      {/* Eyebrows */}
      <path d="M76 104 C80 100, 88 100, 92 104" stroke={hair} strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M108 104 C112 100, 120 100, 124 104" stroke={hair} strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Mouth — changes by pose */}
      {pose === "talking" ? (
        <ellipse cx="100" cy="132" rx="8" ry="5" fill="#E88B7A" />
      ) : (
        <path d="M90 130 C94 137, 106 137, 110 130" stroke="#D4845A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      )}

      {/* Blush */}
      <ellipse cx="74" cy="124" rx="8" ry="5" fill="#F0B8A0" opacity="0.5" />
      <ellipse cx="126" cy="124" rx="8" ry="5" fill="#F0B8A0" opacity="0.5" />

      {/* Headset — band */}
      <path d="M56 100 C56 68, 76 48, 100 48 C124 48, 144 68, 144 100" stroke={headset} strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* Headset — ear pieces */}
      <rect x="48" y="96" width="14" height="18" rx="4" fill={headset} />
      <rect x="138" y="96" width="14" height="18" rx="4" fill={headset} />
      {/* Headset — microphone arm */}
      <path d="M55 108 C50 108, 42 118, 44 128 C44 132, 48 138, 56 138" stroke={headset} strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Mic piece */}
      <ellipse cx="58" cy="138" rx="6" ry="5" fill={headset} />

      {/* Arms — pose-dependent */}
      {pose === "waving" && (
        <>
          {/* Left arm at side */}
          <path d="M72 190 C60 200, 50 215, 48 230" stroke={skinTone} strokeWidth="14" strokeLinecap="round" fill="none" />
          {/* Right arm waving up */}
          <path d="M128 185 C140 175, 150 155, 156 140" stroke={skinTone} strokeWidth="14" strokeLinecap="round" fill="none" />
          {/* Right hand open */}
          <circle cx="158" cy="136" r="9" fill={skinTone} />
          {/* Fingers */}
          <path d="M153 128 L150 120" stroke={skinTone} strokeWidth="4" strokeLinecap="round" />
          <path d="M157 127 L156 118" stroke={skinTone} strokeWidth="4" strokeLinecap="round" />
          <path d="M161 128 L162 119" stroke={skinTone} strokeWidth="4" strokeLinecap="round" />
          <path d="M164 131 L168 124" stroke={skinTone} strokeWidth="4" strokeLinecap="round" />
        </>
      )}

      {pose === "talking" && (
        <>
          {/* Both arms at sides, one slightly raised (gesturing) */}
          <path d="M72 190 C60 200, 50 215, 48 230" stroke={skinTone} strokeWidth="14" strokeLinecap="round" fill="none" />
          <path d="M128 190 C138 195, 148 200, 155 210" stroke={skinTone} strokeWidth="14" strokeLinecap="round" fill="none" />
          <circle cx="158" cy="214" r="8" fill={skinTone} />
        </>
      )}

      {pose === "thumbsUp" && (
        <>
          {/* Left arm at side */}
          <path d="M72 190 C60 200, 50 215, 48 230" stroke={skinTone} strokeWidth="14" strokeLinecap="round" fill="none" />
          {/* Right arm thumbs up */}
          <path d="M128 185 C142 175, 148 165, 150 155" stroke={skinTone} strokeWidth="14" strokeLinecap="round" fill="none" />
          {/* Fist */}
          <rect x="142" y="145" width="16" height="14" rx="7" fill={skinTone} />
          {/* Thumb up */}
          <path d="M148 146 L146 132" stroke={skinTone} strokeWidth="6" strokeLinecap="round" />
        </>
      )}

      {pose === "thinking" && (
        <>
          {/* Left arm at side */}
          <path d="M72 190 C60 200, 50 215, 48 230" stroke={skinTone} strokeWidth="14" strokeLinecap="round" fill="none" />
          {/* Right arm to chin */}
          <path d="M128 185 C136 178, 132 160, 118 145" stroke={skinTone} strokeWidth="14" strokeLinecap="round" fill="none" />
          <circle cx="116" cy="140" r="8" fill={skinTone} />
        </>
      )}

      {/* Collar detail */}
      <path d="M85 172 L100 182 L115 172" stroke={tealDark} strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}
