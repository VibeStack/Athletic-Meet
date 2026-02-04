import React from "react";

export const TrophyIcon = ({ color, className }) => (
  <svg className={className || "w-8 h-8"} viewBox="0 0 24 24" fill={color}>
    <path d="M19 5h-2V3H7v2H5a2 2 0 00-2 2v1c0 2.5 1.9 4.6 4.4 4.9A5 5 0 0011 15.9V19H7v2h10v-2h-4v-3.1a5 5 0 003.6-3C19.1 12.6 21 10.5 21 8V7a2 2 0 00-2-2z" />
  </svg>
);
