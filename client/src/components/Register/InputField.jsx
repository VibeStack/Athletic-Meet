import { useState } from "react";

export default function InputField({
  label,
  id,
  type = "text",
  register,
  inputMode,
  rules,
  errors,
  placeholder,
  icon,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword((p) => !p);

  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="mb-6">
      {/* Label */}
      <label
        htmlFor={id}
        className="block text-gray-800 font-semibold text-sm md:text-base"
      >
        {label}
      </label>

      {/* Input Container */}
      <div className="relative">
        {icon && (
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 transition-colors">
            {icon}
          </span>
        )}

        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          inputMode={inputMode}
          className={`w-full px-4 py-3 border-2 rounded-xl bg-white
            focus:outline-none focus:ring-0
            placeholder:text-sm placeholder:text-gray-400 
            text-gray-700 text-sm md:text-base
            transition-all duration-200
            ${icon ? "pl-10" : ""}
            ${
              errors && errors[id]
                ? "border-red-500 focus:border-red-500"
                : "border-gray-200 focus:border-blue-500 hover:border-gray-300"
            }`}
          {...register(id, rules)}
        />

        {type === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors touch-manipulation"
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 16 16"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M8 2.008c3.934 0 6.473 3.129 7.455 4.583l.043.064C15.713 6.97 16 7.391 16 8s-.287 1.03-.502 1.345l-.043.064c-.982 1.454-3.521 4.583-7.455 4.583S1.527 10.863.545 9.41l-.043-.064C.287 9.03 0 8.609 0 8s.287-1.03.502-1.345l.043-.064C1.527 5.137 4.066 2.008 8 2.008ZM9.13 4.13A5.147 5.147 0 0 0 8 4.005C5.75 4.005 3.927 5.794 3.927 8c0 2.206 1.824 3.995 4.073 3.995 2.25 0 4.073-1.789 4.073-3.995 0-2.206-1.824-3.995-4.073-3.995.378 0 .756.045 1.13.126ZM8 10.996c1.687 0 3.055-1.341 3.055-2.996S9.687 5.004 8 5.004 4.945 6.345 4.945 8 6.313 10.996 8 10.996Z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 16 16"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M14.601 1.266a1.03 1.03 0 0 0-1.433.049L1.704 13.486a.987.987 0 0 0 .062 1.407 1.03 1.03 0 0 0 1.433-.049l1.793-1.904A7.348 7.348 0 0 0 8 13.587c3.934 0 6.473-3.133 7.455-4.59l.043-.063c.215-.316.502-.737.502-1.347s-.287-1.03-.502-1.346l-.043-.065a12.85 12.85 0 0 0-1.949-2.275l1.157-1.228a.987.987 0 0 0-.062-1.407Zm-2.93 4.585-.764.81c.096.292.148.603.148.926 0 1.657-1.368 3-3.055 3-.246 0-.485-.028-.714-.082l-.763.81c.458.176.956.272 1.477.272 2.25 0 4.073-1.79 4.073-4 0-.622-.145-1.211-.403-1.736ZM8 1.587c.919 0 1.762.171 2.526.452L8.98 3.68A5.13 5.13 0 0 0 8 3.587c-2.25 0-4.073 1.79-4.073 4 0 .435.07.853.201 1.245l-1.985 2.107A13.06 13.06 0 0 1 .545 8.998l-.043-.064C.287 8.618 0 8.197 0 7.587s.287-1.03.502-1.346l-.043-.065C1.527 4.72 4.066 1.587 8 1.587Zm0 2c.327 0 .654.034.978.095l-.016.017A4.155 4.155 0 0 0 8 3.587Zm0 1c.041 0 .083 0 .124.002L4.966 7.942a2.978 2.978 0 0 1-.02-.355c0-1.657 1.367-3 3.054-3Z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Error Message - Fixed height container to prevent layout shift */}
      <div className="absolute pt-1">
        {errors && errors[id] && (
          <p className="text-red-500 text-[10px] flex items-center gap-1">
            <svg
              className="w-3.5 h-3.5 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {errors[id].message}
          </p>
        )}
      </div>
    </div>
  );
}
