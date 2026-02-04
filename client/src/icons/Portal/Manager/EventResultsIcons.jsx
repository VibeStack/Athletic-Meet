import React from "react";

export const TrophyIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M19 5h-2V3H7v2H5a2 2 0 00-2 2v1c0 2.5 1.9 4.6 4.4 4.9A5 5 0 0011 15.9V19H7v2h10v-2h-4v-3.1a5 5 0 003.6-3C19.1 12.6 21 10.5 21 8V7a2 2 0 00-2-2z" />
  </svg>
);

export const MedalIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1l4 7-1.26.37.25 1.17L14.5 16l.25 1.17-2.75-.82-2.75.82L9.5 16l-2.49.54.25-1.17L6 15l4-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 012-2zm0 10a2 2 0 100 4 2 2 0 000-4z" />
  </svg>
);

export const PositionIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M7.5 21H2V9h5.5v12zM21 3h-5.5v18H21V3zm-6.75 6h-5.5v12h5.5V9z" />
  </svg>
);

export const BadgeIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M20 7h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 4h4v3h-4V4zm1 13h-2v-2h2v2zm0-4h-2v-2h2v2zm4 4h-2v-2h2v2zm0-4h-2v-2h2v2z" />
  </svg>
);

export const EventIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
  </svg>
);

export const InfoIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
  </svg>
);

export const CheckIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
  >
    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const SendIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);

export const WinnerMedalIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <circle cx="12" cy="15" r="6" />
    <path d="M12 2L9 9h6L12 2z" />
  </svg>
);
