import React from "react";

/* -------------------- Colored accent for info cards - ALL DIFFERENT -------------------- */
const INFO_CARD_COLORS = [
  { border: "border-l-red-500", label: "text-red-500" }, // Red
  { border: "border-l-orange-500", label: "text-orange-500" }, // Orange
  { border: "border-l-amber-500", label: "text-amber-500" }, // Golden/Yellow
  { border: "border-l-emerald-500", label: "text-emerald-500" }, // Parrot Green
  { border: "border-l-cyan-500", label: "text-cyan-500" }, // Cyan/Teal
  { border: "border-l-pink-500", label: "text-pink-500" }, // Pink
  { border: "border-l-violet-500", label: "text-violet-500" }, // Purple
  { border: "border-l-amber-700", label: "text-amber-700" }, // Amber
];

/* -------------------- SVG Icons -------------------- */
const ICONS = {
  user: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  ),
};

export default function UserDetailInfo({ userData, darkMode }) {
  const userInfoItems = [
    { label: "Full Name", value: userData.fullname },
    { label: "Username", value: userData.username },
    { label: "Branch", value: userData.branch },
    { label: "Course", value: userData.course },
    { label: "Year", value: userData.year },
    { label: "Gender", value: userData.gender },
    { label: "CRN", value: userData.crn },
    { label: "URN", value: userData.urn },
  ];

  return (
    <section
      className={`lg:col-span-3 rounded-2xl overflow-hidden ${
        darkMode
          ? "bg-slate-900/80 border border-white/10"
          : "bg-white border border-slate-200 shadow-lg"
      }`}
    >
      <div
        className={`px-4 py-3 border-b flex items-center gap-2.5 ${
          darkMode ? "border-white/5" : "border-slate-100"
        }`}
      >
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${
            darkMode ? "bg-slate-700" : "bg-slate-800"
          }`}
        >
          {ICONS.user}
        </div>
        <h2
          className={`font-bold text-sm ${
            darkMode ? "text-white" : "text-slate-800"
          }`}
        >
          User Information
        </h2>
      </div>

      {/* Single column list - matching screenshot */}
      <div className="p-3 space-y-2">
        {userInfoItems.map((item, idx) => {
          const colorStyle = INFO_CARD_COLORS[idx % INFO_CARD_COLORS.length];
          return (
            <div
              key={idx}
              className={`rounded-lg p-2 border-l-4 ${colorStyle.border} ${
                darkMode ? "bg-slate-800/60" : "bg-slate-50"
              }`}
            >
              <p
                className={`text-[10px] uppercase tracking-wider font-bold ${colorStyle.label}`}
              >
                {item.label}
              </p>
              <p
                className={`font-semibold text-sm mt-0.5 ${
                  darkMode ? "text-slate-200" : "text-slate-700"
                }`}
              >
                {item.value || "—"}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
