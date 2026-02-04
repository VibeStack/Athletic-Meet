import React, { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { generateQr } from "./generateQr";
import ProfileField from "./ProfileField";
import LoadingComponent from "./LoadingComponent";
import { useUserDetail } from "../../context/UserDetailContext";

const attendanceBadgeMap = {
  present: {
    label: "Present",
    dark: "bg-emerald-500/15 text-emerald-400",
    light: "bg-emerald-100 text-emerald-700",
  },
  absent: {
    label: "Absent",
    dark: "bg-red-500/15 text-red-400",
    light: "bg-red-100 text-red-700",
  },
  notMarked: {
    label: "Not Marked",
    dark: "bg-slate-500/15 text-slate-400",
    light: "bg-slate-100 text-slate-600",
  },
};

export default function PortalHome() {
  const { user } = useOutletContext();
  const { userEventsList } = useUserDetail();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.jerseyNumber) {
      setQrCodeDataUrl("");
      return;
    }

    const qrPayload = {
      id: "GNDEC Athletix 2026",
      jerseyNumber: user.jerseyNumber,
    };

    console.log({ qrPayload });

    generateQr(qrPayload, {
      darkMode,
      width: 180,
    }).then(setQrCodeDataUrl);
    setIsLoading(false);
  }, [user?.username, user?.jerseyNumber, user?.selectedEvents, darkMode]);

  return isLoading ? (
    <LoadingComponent
      title="Loading Dashboard"
      message="Preparing Your Profile, Events & Access"
      darkMode={darkMode}
    />
  ) : (
    <>
      <section
        className={`relative overflow-hidden rounded-3xl transition-all duration-500 ${
          darkMode
            ? "bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.7)]"
            : "bg-linear-to-br from-slate-100 via-white to-slate-200 border border-slate-200 shadow-[0_30px_100px_rgba(15,23,42,0.12)]"
        }`}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div
            className={`absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-30 ${
              darkMode ? "bg-cyan-500" : "bg-slate-300"
            }`}
          />
          <div
            className={`absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl opacity-25 ${
              darkMode ? "bg-blue-500" : "bg-slate-200"
            }`}
          />
        </div>

        <div className="relative z-10 p-8 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl">
            <div
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4 ${
                darkMode
                  ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-400/30"
                  : "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Active Session
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              <span
                className={
                  darkMode
                    ? "bg-linear-to-r from-sky-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent"
                    : "bg-linear-to-r from-slate-800 via-slate-500 to-slate-800 bg-clip-text text-transparent"
                }
              >
                Congratulations,
              </span>{" "}
              <span
                className={
                  darkMode
                    ? "bg-linear-to-r from-sky-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent"
                    : "bg-linear-to-r from-slate-800 via-slate-500 to-slate-800 bg-clip-text text-transparent"
                }
              >
                <span className="font-extrabold">
                  {user?.fullname?.split(" ")[0]}
                </span>
              </span>{" "}
              🎉
            </h1>

            <p
              className={`mt-2 text-sm ${
                darkMode ? "text-slate-400" : "text-slate-600"
              }`}
            >
              65th Annual Athletic Meet • GNDEC Ludhiana
            </p>

            <div
              className={`mt-6 inline-flex items-center gap-4 px-6 py-4 rounded-2xl ${
                darkMode
                  ? "bg-slate-800/70 ring-1 ring-white/10"
                  : "bg-white/80 backdrop-blur ring-1 ring-slate-300 shadow-md"
              }`}
            >
              <div
                className={`min-w-12 h-12 px-2 rounded-xl flex items-center justify-center font-black text-lg ${
                  darkMode
                    ? "bg-linear-to-br from-cyan-500 to-blue-500 text-white"
                    : "bg-black text-white"
                }`}
              >
                # {user?.jerseyNumber}
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400">
                  Jersey Number
                </p>
                <p
                  className={`font-bold ${
                    darkMode ? "text-white" : "text-slate-700"
                  }`}
                >
                  Assigned
                </p>
              </div>
            </div>
          </div>

          {qrCodeDataUrl && (
            <div
              className={`relative rounded-2xl p-6 flex flex-col items-center ${
                darkMode
                  ? "bg-slate-950 border border-white/10 shadow-[0_0_40px_rgba(56,189,248,0.25)]"
                  : "bg-white border border-slate-300 shadow-xl"
              }`}
            >
              {/* INNER QR SURFACE */}
              <div
                className={`rounded-xl p-4 transition-all ${
                  darkMode
                    ? "bg-[#04132D] shadow-[0_10px_30px_rgba(56,189,248,0.25)]"
                    : "bg-white shadow-md"
                }`}
              >
                <img
                  src={qrCodeDataUrl}
                  alt="Attendance QR"
                  className="w-40 h-40"
                />
              </div>

              {/* LABEL */}
              <p
                className={`mt-4 text-sm font-semibold tracking-wide ${
                  darkMode ? "text-sky-400" : "text-slate-800"
                }`}
              >
                Scan for Attendance
              </p>
            </div>
          )}
        </div>
      </section>

      {/* EVENTS / ROLE / CERTIFICATES SECTION */}
      <section className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* EVENTS — PRIMARY */}
        <div
          onClick={() => navigate("/portal/events")}
          className={`lg:col-span-2 cursor-pointer rounded-3xl p-6 sm:px-8 sm:py-6 relative overflow-hidden transition-all duration-300 hover:scale-[1.01] ${
            darkMode
              ? "bg-linear-to-br from-slate-900 via-slate-900 to-slate-950 ring-1 ring-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.65)]"
              : "bg-white ring-1 ring-slate-200 shadow-xl"
          }`}
        >
          {/* Ambient glow */}
          {darkMode && (
            <>
              <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-500/20 blur-3xl rounded-full" />
              <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-500/20 blur-3xl rounded-full" />
            </>
          )}

          {/* Header */}
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                  darkMode
                    ? "bg-linear-to-br from-cyan-500 to-blue-600 text-white"
                    : "bg-black text-white"
                }`}
              >
                {/* SVG — UNTOUCHED */}
                <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current">
                  <path d="M13.5 5.5a2 2 0 100-4 2 2 0 000 4zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1L6 8.3V13h2V9.6l1.8-.7" />
                </svg>
              </div>

              <div>
                <p
                  className={`text-xs uppercase tracking-wide font-bold ${
                    darkMode ? "text-cyan-400" : "text-slate-500"
                  }`}
                >
                  Your Events
                </p>
                <p
                  className={`text-3xl font-black ${
                    darkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  {userEventsList.length}
                </p>
              </div>
            </div>

            <span
              className={`text-xs font-semibold ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              View all →
            </span>
          </div>

          {userEventsList.length > 0 ? (
            <div className="relative mt-6">
              <div className="flex gap-4 overflow-x-auto overflow-y-hidden pb-4 scrollbar-slim">
                {userEventsList.map(
                  (
                    { eventName, eventType, eventDay, userEventAttendance },
                    idx,
                  ) => (
                    <div
                      key={idx}
                      className={`snap-start min-w-[290px] h-[90px] rounded-xl p-4 shrink-0 ${
                        darkMode
                          ? "bg-slate-950 ring-1 ring-white/10"
                          : "bg-slate-50 ring-1 ring-slate-200"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3
                          className={`font-semibold leading-tight line-clamp-1 ${
                            darkMode ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {eventName}
                        </h3>
                        {(() => {
                          const attendanceStatus =
                            userEventAttendance || "notMarked";
                          const badge =
                            attendanceBadgeMap[attendanceStatus] ||
                            attendanceBadgeMap.notMarked;

                          return (
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                                darkMode ? badge.dark : badge.light
                              }`}
                            >
                              {badge.label}
                            </span>
                          );
                        })()}
                      </div>

                      <p className="text-sm text-slate-500 line-clamp-1">
                        {eventType} • {eventDay}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>
          ) : (
            <div
              className={`mt-4 rounded-2xl border-2 border-dashed py-5 h-[90px] text-center
              ${
                darkMode
                  ? "border-slate-700 text-slate-500"
                  : "border-slate-300 text-slate-400"
              }`}
            >
              <p className="font-medium">No events selected yet</p>
              <p className="text-sm mt-1">Click to browse events</p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-6">
          {/* ROLE */}
          <div
            className={`rounded-3xl p-6 relative overflow-hidden ${
              darkMode
                ? "bg-linear-to-br from-emerald-900/60 to-slate-900 ring-1 ring-emerald-500/30"
                : "bg-white ring-1 ring-slate-200"
            }`}
          >
            {darkMode && (
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-500/20 blur-2xl rounded-full" />
            )}

            <div className="relative flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center
            ${
              darkMode
                ? "bg-linear-to-br from-emerald-500 to-green-600 text-white"
                : "bg-black text-white"
            }`}
              >
                {/* Shield SVG */}
                <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                </svg>
              </div>
              <div>
                <p
                  className={`text-xs uppercase tracking-wide font-bold ${
                    darkMode ? "text-emerald-400" : "text-slate-500"
                  }`}
                >
                  Role
                </p>
                <p
                  className={`text-2xl font-black ${
                    darkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  {user.role}
                </p>
              </div>
            </div>
          </div>

          {/* CERTIFICATES */}
          <div
            onClick={() => navigate("/portal/certificates")}
            className={`cursor-pointer rounded-3xl p-6 relative overflow-hidden transition-all hover:scale-[1.02]
              ${
                darkMode
                  ? "bg-linear-to-br from-amber-900/50 to-slate-900 ring-1 ring-amber-500/30"
                  : "bg-white ring-1 ring-slate-200"
              }`}
          >
            {darkMode && (
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-500/20 blur-2xl rounded-full" />
            )}

            <div className="relative flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center
                  ${
                    darkMode
                      ? "bg-linear-to-br from-amber-500 to-orange-500 text-white"
                      : "bg-black text-white"
                  }`}
              >
                {/* Trophy SVG */}
                <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current">
                  <path d="M19 5h-2V3H7v2H5a2 2 0 00-2 2v1c0 2.5 1.9 4.6 4.4 4.9A5 5 0 0011 15.9V19H7v2h10v-2h-4v-3.1a5 5 0 003.6-3C19.1 12.6 21 10.5 21 8V7a2 2 0 00-2-2z" />
                </svg>
              </div>

              <div>
                <p
                  className={`text-xs uppercase tracking-wide font-bold ${
                    darkMode ? "text-amber-400" : "text-slate-500"
                  }`}
                >
                  Certificates
                </p>
                <p
                  className={`text-2xl font-black ${
                    darkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  {
                    userEventsList.filter(
                      (e) => e.userEventAttendance === "present",
                    ).length
                  }
                </p>
              </div>

              <span
                className={`absolute right-1 top-1/32 -translate-y-1/2 text-xs font-semibold ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                View all →
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* PROFILE SECTION */}
      <section className="mt-10">
        <div
          className={`rounded-3xl p-6 sm:p-8 relative overflow-hidden ${
            darkMode
              ? "bg-slate-900 ring-1 ring-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
              : "bg-white ring-1 ring-slate-200 shadow-xl"
          }`}
        >
          {darkMode && (
            <>
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none bg-cyan-500" />
              <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full blur-2xl opacity-15 pointer-events-none bg-blue-500" />
            </>
          )}

          <div className="relative flex items-center justify-between gap-4 mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                  darkMode
                    ? "bg-linear-to-br from-cyan-500 to-blue-600 text-white"
                    : "bg-black text-white"
                }`}
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <div>
                <h2
                  className={`text-lg sm:text-xl font-bold ${
                    darkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  Profile Details
                </h2>
                <p
                  className={`text-xs ${
                    darkMode ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  Your personal information
                </p>
              </div>
            </div>
            <div
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                darkMode
                  ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30"
                  : "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Verified
            </div>
          </div>

          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <ProfileField
              label="Full Name"
              value={user.fullname}
              accent="red"
            />
            <ProfileField
              label="Username"
              value={user.username}
              accent="orange"
            />
            <ProfileField label="Email" value={user.email} accent="yellow" />
            <ProfileField label="Course" value={user.course} accent="emerald" />
            <ProfileField label="Branch" value={user.branch} accent="blue" />
            <ProfileField label="Year" value={user.year} accent="purple" />
            <ProfileField
              label="URN / CRN"
              value={`${user.urn || "—"} / ${user.crn || "—"}`}
              accent="pink"
            />
            <ProfileField label="Phone" value={user.phone} accent="indigo" />
          </div>
        </div>
      </section>
    </>
  );
}
