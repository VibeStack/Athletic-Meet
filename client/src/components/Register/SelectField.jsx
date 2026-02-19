import React from "react";

export default function SelectField({
  label,
  id,
  options = [],
  register,
  rules,
  errors,
  disabled = false,
  icon,
  ...rest
}) {
  return (
    <div className="mb-6">
      {/* Label */}
      <label
        htmlFor={id}
        className="block text-gray-800 font-semibold text-sm md:text-base"
      >
        {label}
      </label>

      {/* Select Container */}
      <div className="relative">
        {icon && (
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
            {icon}
          </span>
        )}

        <select
          id={id}
          disabled={disabled}
          defaultValue=""
          className={`w-full px-4 py-3 border-2 rounded-xl bg-white
            focus:outline-none focus:ring-0
            text-sm md:text-base
            transition-transform 
            appearance-none
            ${icon ? "pl-10" : ""}
            ${
              disabled
                ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                : errors && errors[id]
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-200 focus:border-blue-500 hover:border-gray-300"
            }
            text-gray-400
            has-[option:checked:not([value=''])]:text-gray-700
          `}
          {...register(id, rules)}
          {...rest}
        >
          <option value="" disabled hidden>
            Select {label}
          </option>

          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        {/* Dropdown Icon */}
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </div>

      {/* Error Message (fixed space, no layout shift) */}
      <div className="absolute pt-1">
        {errors && errors[id] && !disabled && (
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
            <span>{errors[id].message}</span>
          </p>
        )}
      </div>
    </div>
  );
}
