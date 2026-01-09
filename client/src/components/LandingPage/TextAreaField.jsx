import React from "react";

export default function TextAreaField({
  label,
  id,
  register,
  rules,
  errors,
  placeholder,
  rows = 5,
  darkMode
}) {
  return (
    <div className="mb-4 relative">
      <label
        htmlFor={id}
        className={`block text-gray-700 font-semibold mb-1 ml-1 text-xl ${darkMode ? "text-white" : "text-gray-700"}`}
      >
        {label}
      </label>

      <textarea
        id={id}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        {...register(id, rules)}
      ></textarea>

      {errors && errors[id] && (
        <p className="text-red-600 text-[12px] absolute -bottom-3 pl-1">
          {errors[id].message}
        </p>
      )}
    </div>
  );
}
