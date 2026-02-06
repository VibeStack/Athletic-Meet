import { useState } from "react";

export default function InputField({
  label,
  id,
  type = "text",
  register,
  rules = {},
  errors,
  placeholder,
  icon,
  darkMode,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword((p) => !p);

  const isPassword = type === "password";
  const isPhone = type === "phone";

  const inputType = isPassword
    ? showPassword
      ? "text"
      : "password"
    : isPhone
      ? "tel"
      : type;

  // Phone-specific validation (merged safely)
  const phoneRules = isPhone
    ? {
        required: "Phone number is required",
        pattern: {
          value: /^[0-9]{10}$/,
          message: "Enter a valid 10-digit phone number",
        },
      }
    : {};

  return (
    <div className="relative pb-4 mb-2">
      <label
        htmlFor={id}
        className={`block font-semibold ml-1 text-sm sm:text-base mb-1.5 ${
          darkMode ? "text-gray-200" : "text-gray-700"
        }`}
      >
        {label}
      </label>

      <div className="relative">
        {icon && (
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            {icon}
          </span>
        )}

        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          inputMode={isPhone ? "numeric" : undefined}
          maxLength={isPhone ? 14 : undefined} // Allow space for + and spaces if needed, though pattern is 10 digits
          className={`w-full ${
            icon ? "pl-10" : "pl-4"
          } ${isPassword ? "pr-10" : "pr-4"} py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-orange-500/50"
              : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-orange-500/30"
          } ${
            errors && errors[id]
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300"
          }`}
          {...register(id, {
            ...phoneRules,
            ...rules,
          })}
          onFocus={(e) => {
            if (isPhone && !e.target.value) {
              e.target.value = "+";
            }
          }}
          onBlur={(e) => {
            if (isPhone && e.target.value === "+") {
              e.target.value = "";
            }
          }}
        />

        {/* Password toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        )}
      </div>

      {errors && errors[id] && (
        <p className="absolute text-red-600 text-[12px] mt-1 pl-1">
          {errors[id].message}
        </p>
      )}
    </div>
  );
}
