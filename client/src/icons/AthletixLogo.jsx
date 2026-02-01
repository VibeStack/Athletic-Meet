import React from "react";

export const AthletixLogo = ({ className, size = "md" }) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      className={`${sizes[size]} ${className || ""}`}
    >
      <defs>
        <linearGradient id="logoGoldMain" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF7CC" />
          <stop offset="20%" stopColor="#FFE066" />
          <stop offset="40%" stopColor="#FFD700" />
          <stop offset="60%" stopColor="#FFA500" />
          <stop offset="80%" stopColor="#FF8C00" />
          <stop offset="100%" stopColor="#E67300" />
        </linearGradient>

        <linearGradient id="logoGoldShine" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFACD" />
          <stop offset="30%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#CC8800" />
        </linearGradient>

        <linearGradient id="logoCyanAccent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#67E8F9" />
          <stop offset="50%" stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#0EA5E9" />
        </linearGradient>

        <linearGradient
          id="logoPurpleAccent"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>

        <filter id="logoGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="3"
            floodColor="#FFD700"
            floodOpacity="0.6"
          />
        </filter>

        <filter
          id="logoInnerShine"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur" />
          <feOffset in="blur" dx="1" dy="1" result="offsetBlur" />
          <feComposite in="SourceGraphic" in2="offsetBlur" operator="over" />
        </filter>
      </defs>

      <circle
        cx="32"
        cy="28"
        r="22"
        fill="url(#logoCyanAccent)"
        opacity="0.08"
      />

      <path
        d="M20 12 L44 12 L44 28 C44 38 34 46 32 46 C30 46 20 38 20 28 Z"
        fill="url(#logoGoldMain)"
        stroke="url(#logoGoldShine)"
        strokeWidth="1"
        filter="url(#logoGlow)"
      />

      <path
        d="M24 14 L38 14 L37 22 C37 26 34 30 32 30 C30 30 27 26 27 22 Z"
        fill="url(#logoGoldShine)"
        opacity="0.3"
      />

      <path
        d="M20 16 L14 16 C10 16 8 20 8 24 C8 28 10 32 14 32 L20 32"
        fill="none"
        stroke="url(#logoGoldMain)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      <path
        d="M44 16 L50 16 C54 16 56 20 56 24 C56 28 54 32 50 32 L44 32"
        fill="none"
        stroke="url(#logoGoldMain)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      <rect
        x="28"
        y="46"
        width="8"
        height="6"
        fill="url(#logoGoldMain)"
        rx="1"
      />

      <rect
        x="21"
        y="52"
        width="22"
        height="5"
        fill="url(#logoGoldMain)"
        rx="2"
      />

      <rect
        x="23"
        y="52"
        width="18"
        height="2"
        fill="url(#logoGoldShine)"
        opacity="0.4"
        rx="1"
      />

      <polygon
        points="32,16 34.5,23 42,23 36,28 38.5,35 32,31 25.5,35 28,28 22,23 29.5,23"
        fill="url(#logoCyanAccent)"
        filter="url(#logoInnerShine)"
      />

      <circle cx="32" cy="25" r="1.5" fill="white" opacity="0.9" />
    </svg>
  );
};

export const AthletixIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    className={className}
  >
    <defs>
      <linearGradient id="iconGoldPremium" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF7CC" />
        <stop offset="30%" stopColor="#FFD700" />
        <stop offset="70%" stopColor="#FFA500" />
        <stop offset="100%" stopColor="#E67300" />
      </linearGradient>
      <linearGradient id="iconCyanPremium" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#67E8F9" />
        <stop offset="100%" stopColor="#0EA5E9" />
      </linearGradient>
      <filter id="iconGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow
          dx="0"
          dy="1"
          stdDeviation="1.5"
          floodColor="#FFD700"
          floodOpacity="0.5"
        />
      </filter>
    </defs>

    <path
      d="M10 6 L22 6 L22 14 C22 19 17 23 16 23 C15 23 10 19 10 14 Z"
      fill="url(#iconGoldPremium)"
      filter="url(#iconGlow)"
    />

    <path
      d="M10 8 L7 8 C5 8 4 10 4 12 C4 14 5 16 7 16 L10 16"
      fill="none"
      stroke="url(#iconGoldPremium)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M22 8 L25 8 C27 8 28 10 28 12 C28 14 27 16 25 16 L22 16"
      fill="none"
      stroke="url(#iconGoldPremium)"
      strokeWidth="2"
      strokeLinecap="round"
    />

    <rect
      x="14"
      y="23"
      width="4"
      height="3"
      fill="url(#iconGoldPremium)"
      rx="0.5"
    />
    <rect
      x="11"
      y="26"
      width="10"
      height="2.5"
      fill="url(#iconGoldPremium)"
      rx="1"
    />

    <polygon
      points="16,9 17.2,12.5 21,12.5 18,15 19.2,18.5 16,16 12.8,18.5 14,15 11,12.5 14.8,12.5"
      fill="url(#iconCyanPremium)"
    />

    <circle cx="16" cy="13" r="0.8" fill="white" opacity="0.8" />
  </svg>
);

export default AthletixLogo;
