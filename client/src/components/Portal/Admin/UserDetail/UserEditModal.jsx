import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

// Course-branch mapping (matching backend courseBranchMap)
const courseBranchMap = {
  "B.Tech": [
    "Computer Science & Engineering",
    "Information Technology",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electronics & Communication Engineering",
    "Robotics & AI",
  ],
  "M.Tech": [
    "Computer Science & Engineering",
    "Electronics Engineering",
    "Mechanical Engineering",
    "Production Engineering",
    "Geo Technical Engineering",
    "Structural Engineering",
    "Environmental Science & Engineering",
  ],
  MBA: ["Finance", "Marketing", "Human Resource"],
  MCA: ["Computer Applications"],
  "B.Voc.": ["Interior Design"],
  "B.Com": ["Entrepreneurship"],
  BBA: [],
  BCA: [],
  "B.Arch": [],
};

export default function UserEditModal({
  isOpen,
  onClose,
  studentUserData,
  darkMode,
  onSave,
}) {
  const { register, handleSubmit, reset, control } = useForm();
  const selectedCourse = useWatch({ control, name: "course" });

  // Branch state managed by useEffect
  const [branchOptions, setBranchOptions] = useState([]);
  const [isBranchDisabled, setIsBranchDisabled] = useState(true);

  useEffect(() => {
    if (selectedCourse) {
      const branches = courseBranchMap[selectedCourse] || [];
      setBranchOptions(branches);
      setIsBranchDisabled(branches.length === 0);
    } else {
      setBranchOptions([]);
      setIsBranchDisabled(true);
    }
  }, [selectedCourse]);

  // Reset form when modal opens with user data
  useEffect(() => {
    if (isOpen && studentUserData) {
      reset({
        fullname: studentUserData.fullname || "",
        branch: studentUserData.branch || "",
        course: studentUserData.course || "",
        year: studentUserData.year || "",
        gender: studentUserData.gender || "",
        crn: studentUserData.crn || "",
        urn: studentUserData.urn || "",
      });
    }
  }, [isOpen, studentUserData, reset]);

  if (!isOpen) return null;

  // Helper to get accent color based on role/gender
  const getAccentColor = () => {
    if (studentUserData.role === "Manager") return "red";
    if (studentUserData.gender === "Male") return "sky";
    if (studentUserData.gender === "Female") return "pink";
    return "emerald";
  };

  const accent = getAccentColor();

  const handleFormSubmit = (data) => {
    // If course has no branches, set branch to null
    const formData = {
      ...data,
      branch: isBranchDisabled ? null : data.branch,
    };
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl ${
          darkMode
            ? "bg-slate-900 border border-white/10"
            : "bg-white border border-slate-200"
        }`}
      >
        {/* Glow based on user role/gender */}
        {darkMode && (
          <div
            className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl pointer-events-none bg-${accent}-500/20`}
          />
        )}

        {/* Header with icon */}
        <div
          className={`relative px-5 py-4 border-b ${
            darkMode ? "border-white/10" : "border-slate-100"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${accent}-500/10`}
            >
              <svg
                viewBox="0 0 24 24"
                className={`w-5 h-5 text-${accent}-500`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </div>
            <div>
              <h3
                className={`text-lg font-bold ${
                  darkMode ? "text-white" : "text-slate-900"
                }`}
              >
                Edit User
              </h3>
              <p
                className={`text-xs ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                {studentUserData.fullname || studentUserData.username}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="p-5 max-h-[55vh] overflow-y-auto space-y-3">
            {/* Full Name */}
            <div>
              <label
                className={`block text-[10px] uppercase tracking-wider font-bold mb-1 text-${accent}-500`}
              >
                Full Name
              </label>
              <input
                type="text"
                {...register("fullname")}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium outline-none transition-all ${
                  darkMode
                    ? "bg-slate-800/80 text-white border border-white/10 focus:border-white/30"
                    : "bg-slate-50 text-slate-900 border border-slate-200 focus:border-slate-300"
                }`}
              />
            </div>

            {/* Course */}
            <div>
              <label
                className={`block text-[10px] uppercase tracking-wider font-bold mb-1 text-${accent}-500`}
              >
                Course
              </label>
              <select
                {...register("course")}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium outline-none transition-all ${
                  darkMode
                    ? "bg-slate-800/80 text-white border border-white/10 focus:border-white/30"
                    : "bg-slate-50 text-slate-900 border border-slate-200 focus:border-slate-300"
                }`}
              >
                <option value="">Select Course</option>
                {Object.keys(courseBranchMap).map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>

            {/* Branch & Year */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  className={`block text-[10px] uppercase tracking-wider font-bold mb-1 text-${accent}-500`}
                >
                  Branch
                </label>
                <select
                  {...register("branch")}
                  disabled={isBranchDisabled}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-medium outline-none transition-all ${
                    isBranchDisabled ? "opacity-50 cursor-not-allowed" : ""
                  } ${
                    darkMode
                      ? "bg-slate-800/80 text-white border border-white/10 focus:border-white/30"
                      : "bg-slate-50 text-slate-900 border border-slate-200 focus:border-slate-300"
                  }`}
                >
                  <option value="">
                    {isBranchDisabled ? "N/A" : "Select"}
                  </option>
                  {branchOptions.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  className={`block text-[10px] uppercase tracking-wider font-bold mb-1 text-${accent}-500`}
                >
                  Year
                </label>
                <select
                  {...register("year")}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-medium outline-none transition-all ${
                    darkMode
                      ? "bg-slate-800/80 text-white border border-white/10 focus:border-white/30"
                      : "bg-slate-50 text-slate-900 border border-slate-200 focus:border-slate-300"
                  }`}
                >
                  <option value="">Select</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="5th Year">5th Year</option>
                </select>
              </div>
            </div>

            {/* Gender & CRN */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  className={`block text-[10px] uppercase tracking-wider font-bold mb-1 text-${accent}-500`}
                >
                  Gender
                </label>
                <select
                  {...register("gender")}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-medium outline-none transition-all ${
                    darkMode
                      ? "bg-slate-800/80 text-white border border-white/10 focus:border-white/30"
                      : "bg-slate-50 text-slate-900 border border-slate-200 focus:border-slate-300"
                  }`}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label
                  className={`block text-[10px] uppercase tracking-wider font-bold mb-1 text-${accent}-500`}
                >
                  CRN
                </label>
                <input
                  type="text"
                  {...register("crn")}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-medium outline-none transition-all ${
                    darkMode
                      ? "bg-slate-800/80 text-white border border-white/10 focus:border-white/30"
                      : "bg-slate-50 text-slate-900 border border-slate-200 focus:border-slate-300"
                  }`}
                />
              </div>
            </div>

            {/* URN */}
            <div>
              <label
                className={`block text-[10px] uppercase tracking-wider font-bold mb-1 text-${accent}-500`}
              >
                URN
              </label>
              <input
                type="text"
                {...register("urn")}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium outline-none transition-all ${
                  darkMode
                    ? "bg-slate-800/80 text-white border border-white/10 focus:border-white/30"
                    : "bg-slate-50 text-slate-900 border border-slate-200 focus:border-slate-300"
                }`}
              />
            </div>
          </div>

          {/* Footer */}
          <div
            className={`px-5 py-4 border-t flex gap-3 ${
              darkMode ? "border-white/10" : "border-slate-100"
            }`}
          >
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${
                darkMode
                  ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm text-white transition-all shadow-lg hover:brightness-110 ${
                studentUserData.role === "Manager"
                  ? "bg-linear-to-r from-red-500 to-red-600 shadow-red-500/25"
                  : studentUserData.gender === "Male"
                  ? "bg-linear-to-r from-sky-500 to-blue-600 shadow-sky-500/25"
                  : studentUserData.gender === "Female"
                  ? "bg-linear-to-r from-pink-500 to-pink-600 shadow-pink-500/25"
                  : "bg-linear-to-r from-emerald-500 to-emerald-600 shadow-emerald-500/25"
              }`}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
