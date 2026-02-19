import React from "react";

export default function TextAreaField({
  label,
  id,
  register,
  rules,
  errors,
  placeholder,
  rows = 5,
  darkMode,
}) {
  return (
    <div className="mb-4 relative">
      <label
        htmlFor={id}
        className={`block font-semibold ml-1 text-sm sm:text-base mb-1.5 ${
          darkMode ? "text-gray-200" : "text-gray-700"
        }`}
      >
        {label}
      </label>

      <textarea
        id={id}
        rows={rows}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-transform  resize-none ${
          darkMode
            ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-orange-500/50"
            : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-orange-500/30"
        } ${
          errors && errors[id]
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300"
        }`}
        {...register(id, rules)}
      ></textarea>

      {errors && errors[id] && (
        <p className="absolute text-red-600 text-[12px] mt-1 pl-1">
          {errors[id].message}
        </p>
      )}
    </div>
  );
}
