import React, { useState } from "react";
import axios from "axios";
import { useUsers } from "../../../../context/UsersContext";
import UserEditModal from "./UserEditModal";
import { useOutletContext } from "react-router-dom";

const roleAccessPoints = (role) => {
  if (role === "Manager") return 3;
  if (role === "Admin") return 2;
  if (role === "Student") return 1;
  else 0;
};

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

export default function UserDetailInfo({
  studentUserData,
  setStudentUserData,
  darkMode,
}) {
  const API_URL = import.meta.env.VITE_API_URL;
  const { user } = useOutletContext(); // user is me ok and studentUserData is student whose details i am viewing ok
  const { updateUserInCache } = useUsers();
  const [showEditModal, setShowEditModal] = useState(false);

  const viewerId = user.id;
  const viewerRole = user.role;
  const targetId = studentUserData.id;
  const targetRole = studentUserData.role;
  const isDetailsComplete = studentUserData.isUserDetailsComplete === "true";
  const isSelf = viewerId === targetId;

  const userInfoItems = [
    { label: "Full Name", value: studentUserData.fullname },
    { label: "Username", value: studentUserData.username },
    { label: "Course", value: studentUserData.course },
    { label: "Branch", value: studentUserData.branch },
    { label: "Year", value: studentUserData.year },
    { label: "Gender", value: studentUserData.gender },
    {
      label: "URN / CRN",
      value: `${studentUserData.urn ?? "—"} / ${studentUserData.crn ?? "—"}`,
    },
    { label: "Phone", value: studentUserData.phone },
  ];

  const handleEditSave = async (formData) => {
    try {
      await axios.patch(
        `${API_URL}/admin/user/${studentUserData.id}`,
        formData,
        { withCredentials: true },
      );
      // Update local state immediately
      setStudentUserData((prev) => ({ ...prev, ...formData }));
      // Update cache in UsersContext
      updateUserInCache(studentUserData.id, formData);
      setShowEditModal(false);
    } catch (err) {
      console.error("Failed to update user", err);
    }
  };

  return (
    <>
      <section
        className={`lg:col-span-3 rounded-2xl overflow-hidden ${
          darkMode
            ? "bg-slate-900/80 border border-white/10"
            : "bg-white border border-slate-200 shadow-lg"
        }`}
      >
        <div
          className={`px-4 py-3 border-b flex items-center justify-between ${
            darkMode ? "border-white/5" : "border-slate-100"
          }`}
        >
          <div className="flex items-center gap-2.5">
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

          {isDetailsComplete &&
            roleAccessPoints(viewerRole) > roleAccessPoints(targetRole) && (
              <button
                onClick={() => setShowEditModal(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-transform ${
                  darkMode
                    ? "bg-slate-700 text-white hover:bg-slate-600"
                    : "bg-slate-800 text-white hover:bg-slate-700"
                }`}
                title="Edit User Info"
              >
                <div className="flex items-center gap-2">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </div>
                <span>Edit Details</span>
              </button>
            )}
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

      {/* ================= EDIT USER MODAL ================= */}
      <UserEditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        studentUserData={studentUserData}
        darkMode={darkMode}
        onSave={handleEditSave}
      />
    </>
  );
}
