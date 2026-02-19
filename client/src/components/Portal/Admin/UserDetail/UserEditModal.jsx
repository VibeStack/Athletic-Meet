import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

// Course-branch mapping (matching backend courseBranchMap)
const courseBranchMap = {
  "B.Tech": [
    "Robotics & AI",
    "Civil Engineering",
    "Information Technology",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Computer Science & Engineering",
    "Electronics & Communication Engineering",
  ],
  "M.Tech": [
    "Power Engineering",
    "Mechanical Engineering",
    "Production Engineering",
    "Structural Engineering",
    "Electronics Engineering",
    "Geo Technical Engineering",
    "Computer Science & Engineering",
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

// Reusable Input Component
function FormInput({
  label,
  name,
  type = "text",
  disabled = false,
  darkMode,
  accent = "blue",
  autoComplete = "off",
  register,
  validation = {},
  error,
  numericOnly = false,
  maxLength,
  placeholder,
  ...props
}) {
  const baseInput =
    "w-full px-3 py-2 rounded-lg text-sm font-medium outline-none transition-transform";

  const themeInput = darkMode
    ? "bg-slate-800/80 text-white border border-white/10 focus:border-white/30"
    : "bg-slate-50 text-slate-900 border border-slate-200 focus:border-slate-300";

  const stateInput = `
    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
    ${error ? "border-red-500 focus:border-red-500" : ""}
  `;

  const placeholderStyle =
    "placeholder:text-slate-400 dark:placeholder:text-slate-500";

  const inputClasses = `${baseInput} ${themeInput} ${stateInput} ${placeholderStyle}`;

  const labelColor = error ? "text-red-500" : `text-${accent}-500`;

  const labelClasses =
    "block text-[10px] uppercase tracking-wider font-bold mb-1 " + labelColor;

  const handleKeyDown = (e) => {
    if (!numericOnly) return;

    if (
      !/[0-9]/.test(e.key) &&
      e.key !== "Backspace" &&
      e.key !== "Delete" &&
      e.key !== "ArrowLeft" &&
      e.key !== "ArrowRight" &&
      e.key !== "Tab"
    ) {
      e.preventDefault();
    }
  };

  return (
    <div className="relative mb-4">
      <label htmlFor={name} className={labelClasses}>
        {label}
      </label>

      <input
        id={name}
        type={numericOnly ? "text" : type}
        inputMode={numericOnly ? "numeric" : undefined}
        pattern={numericOnly ? "[0-9]*" : undefined}
        maxLength={maxLength}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className={inputClasses}
        onKeyDown={handleKeyDown}
        {...(register ? register(name, validation) : {})}
        {...props}
      />

      {error && (
        <p
          id={`${name}-error`}
          className="text-red-500 text-[10px] mt-1 font-medium absolute"
        >
          {error.message}
        </p>
      )}
    </div>
  );
}

// Reusable Select Component
function FormSelect({
  label,
  name,
  options,
  disabled = false,
  darkMode,
  accent = "blue",
  autoComplete = "off",
  register,
  validation = {},
  error,
  placeholder = "Select",
  ...props
}) {
  const baseSelect =
    "w-full px-3 py-2 rounded-lg text-sm font-medium outline-none transition-transform";

  const themeSelect = darkMode
    ? "bg-slate-800/80 text-white border border-white/10 focus:border-white/30"
    : "bg-slate-50 text-slate-900 border border-slate-200 focus:border-slate-300";

  const stateSelect = `
    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
    ${error ? "border-red-500 focus:border-red-500" : ""}
  `;

  // Gray text when no value selected (using invalid state)
  const placeholderColor =
    "[&:invalid]:text-slate-400 [&:invalid]:dark:text-slate-500";

  const selectClasses = `${baseSelect} ${themeSelect} ${stateSelect} ${placeholderColor}`;

  const labelColor = error ? "text-red-500" : `text-${accent}-500`;
  const labelClasses =
    "block text-[10px] uppercase tracking-wider font-bold mb-1 " + labelColor;

  return (
    <div className="relative mb-4">
      <label htmlFor={name} className={labelClasses}>
        {label}
      </label>
      <select
        id={name}
        disabled={disabled}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className={selectClasses}
        required={!!validation.required}
        {...(register ? register(name, validation) : {})}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value || option} value={option.value || option}>
            {option.label || option}
          </option>
        ))}
      </select>
      {error && (
        <p
          id={`${name}-error`}
          className="text-red-500 text-[10px] mt-1 font-medium absolute"
        >
          {error.message}
        </p>
      )}
    </div>
  );
}

export default function UserEditModal({
  isOpen,
  onClose,
  studentUserData,
  darkMode,
  onSave,
}) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm();
  const selectedCourse = useWatch({ control, name: "course" });

  // Branch state managed by useEffect
  const [branchOptions, setBranchOptions] = useState([]);
  const [isBranchDisabled, setIsBranchDisabled] = useState(true);

  useEffect(() => {
    if (selectedCourse) {
      const branches = courseBranchMap[selectedCourse] || [];
      setBranchOptions(branches);
      setIsBranchDisabled(branches.length === 0);
      // Reset branch value when course changes
      setValue("branch", "");
      // Clear any branch errors when course has no branches
      if (branches.length === 0) {
        clearErrors("branch");
      }
    } else {
      setBranchOptions([]);
      setIsBranchDisabled(true);
      setValue("branch", "");
      clearErrors("branch");
    }
  }, [selectedCourse, setValue, clearErrors]);

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
        phone: studentUserData.phone || "",
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
        className={`relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl ${
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
          <div className="p-5 max-h-[60vh] overflow-y-auto space-y-3">
            {/* Row 1: Full Name & Gender */}
            <div className="grid grid-cols-2 gap-3">
              <FormInput
                label="Full Name"
                name="fullname"
                darkMode={darkMode}
                accent={accent}
                placeholder="Enter Your Full Name"
                register={register}
                validation={{
                  required: "Full name is required",
                }}
                error={errors.fullname}
              />
              <FormSelect
                label="Gender"
                name="gender"
                options={["Male", "Female"]}
                darkMode={darkMode}
                accent={accent}
                autoComplete="sex"
                register={register}
                placeholder="Select Gender"
                validation={{
                  required: "Gender is required",
                }}
                error={errors.gender}
              />
            </div>

            {/* Row 2: Course & Branch */}
            <div className="grid grid-cols-2 gap-3">
              <FormSelect
                label="Course"
                name="course"
                options={Object.keys(courseBranchMap)}
                darkMode={darkMode}
                accent={accent}
                autoComplete="off"
                register={register}
                placeholder="Select Course"
                validation={{
                  required: "Course is required",
                }}
                error={errors.course}
              />
              <FormSelect
                label="Branch"
                name="branch"
                options={branchOptions}
                disabled={isBranchDisabled}
                darkMode={darkMode}
                accent={accent}
                autoComplete="off"
                register={!isBranchDisabled ? register : undefined}
                placeholder={
                  isBranchDisabled ? "Not Applicable" : "Select Branch"
                }
                validation={{
                  required: "Branch is required",
                }}
                error={!isBranchDisabled ? errors.branch : undefined}
              />
            </div>

            {/* Row 3: CRN & URN */}
            <div className="grid grid-cols-2 gap-3">
              <FormInput
                label="CRN"
                name="crn"
                darkMode={darkMode}
                accent={accent}
                autoComplete="off"
                placeholder="Enter Your CRN"
                register={register}
                validation={{
                  required: "CRN is required",
                  pattern: {
                    value: /^\d+$/,
                    message: "Only numbers are allowed",
                  },
                }}
                error={errors.crn}
              />

              <FormInput
                label="URN"
                name="urn"
                darkMode={darkMode}
                accent={accent}
                autoComplete="off"
                placeholder="Enter Your URN"
                register={register}
                validation={{
                  required: "URN is required",
                  pattern: {
                    value: /^\d+$/,
                    message: "Only numbers are allowed",
                  },
                }}
                error={errors.urn}
              />
            </div>

            {/* Row 4: Year & Phone */}
            <div className="grid grid-cols-2 gap-3">
              <FormSelect
                label="Year"
                name="year"
                options={["1st Year", "2nd Year", "3rd Year", "4th Year"]}
                darkMode={darkMode}
                accent={accent}
                autoComplete="off"
                register={register}
                placeholder="Select Year"
                validation={{
                  required: "Year is required",
                }}
                error={errors.year}
              />
              <FormInput
                label="Phone Number"
                name="phone"
                darkMode={darkMode}
                accent={accent}
                autoComplete="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="Enter Your Phone Number"
                register={register}
                validation={{
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Must be exactly 10 digits",
                  },
                }}
                error={errors.phone}
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
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-transform ${
                darkMode
                  ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm text-white transition-transform shadow-lg hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                studentUserData.role === "Manager"
                  ? "bg-linear-to-r from-red-500 to-red-600 shadow-red-500/25"
                  : studentUserData.gender === "Male"
                    ? "bg-linear-to-r from-sky-500 to-blue-600 shadow-sky-500/25"
                    : studentUserData.gender === "Female"
                      ? "bg-linear-to-r from-pink-500 to-pink-600 shadow-pink-500/25"
                      : "bg-linear-to-r from-emerald-500 to-emerald-600 shadow-emerald-500/25"
              }`}
            >
              {isSubmitting && (
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
