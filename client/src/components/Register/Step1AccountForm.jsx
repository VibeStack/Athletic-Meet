// components/Register/Step1AccountForm.jsx
import React from "react";
import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import InputField from "./InputField";
import axios from "axios";

export default function Step1AccountForm({ nextStep, setStep }) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useFormContext();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      const response = await axios.post(
        `${API_URL}/otp/registerOtpSender`,
        data,
        {
          withCredentials: true,
        }
      );

      if (response.data.message === "Account already exists. Please log in.") {
        alert("Account already exists. Please log in.");
        navigate("/login");
      } else if (
        response.data.message ===
        "Email already verified. Please complete your profile."
      ) {
        alert("Email already verified. Please complete your profile.");
        setStep(3);
      } else if (
        response.data.message === "OTP already sent. Please check your email."
      ) {
        alert("OTP already sent. Please check your email.");
        nextStep();
      } else if (
        response.data.message ===
        "OTP sent successfully! Please verify your email."
      ) {
        alert("✅ OTP sent to your email. Please verify to continue.");
        nextStep();
      } else if (
        response.data.message ===
        "Username already taken. Please choose another username."
      ) {
        alert("Username already taken. Please choose another username.");
        setError("username", {
          type: "manual",
          message: "Username already taken. Please choose another username.",
        });
      } else {
        alert("⚠️ Something Went Wrong!");
      }
    } catch (error) {
      alert("⚠️ Network Error!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl w-full max-w-md p-6 sm:p-8 md:p-10 mx-auto border border-white/50 transition-all duration-500"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-blue-100 rounded-full blur-xl opacity-50"></div>
          <img
            src="/images/gne_logo.png"
            alt="College Logo"
            className="h-16 w-16 sm:h-20 sm:w-20 mx-auto mb-4 relative z-10 drop-shadow-lg"
          />
        </div>
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 tracking-tight px-2">
          Guru Nanak Dev Engineering College
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Athletic Meet Registration Portal
        </p>
      </div>

      <h3 className="text-base sm:text-lg md:text-xl font-extrabold text-center mb-6 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
        Create Your Account
      </h3>

      <div className="space-y-4 pb-1">
        <InputField
          label="Username"
          id="username"
          placeholder="Enter Username"
          register={register}
          rules={{
            required: {
              value: true,
              message: "Username is required",
            },
            minLength: {
              value: 3,
              message: "Username must be at least 3 characters long",
            },
          }}
          errors={errors}
        />

        <InputField
          label="Email"
          id="email"
          type="email"
          placeholder="Enter your College Email (example@gndec.ac.in)"
          register={register}
          rules={{
            required: { value: true, message: "Email is required" },
            // pattern: {
            //   value: /^[a-zA-Z0-9._%+-]+@gndec\.ac\.in$/,
            //   message: "Valid College Mail must end with @gndec.ac.in",
            // },
          }}
          errors={errors}
        />

        <InputField
          label="Password"
          id="password"
          type="password"
          placeholder="Create a Strong Password"
          register={register}
          rules={{
            required: { value: true, message: "Password is required" },
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters long",
            },
          }}
          errors={errors}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className={`w-full mt-6 py-4 px-4 bg-linear-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-0 transition-all duration-300 flex items-center justify-center gap-2 touch-manipulation ${
          isSubmitting
            ? "opacity-75 cursor-not-allowed"
            : "hover:from-blue-600 hover:to-purple-600"
        }`}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
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
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            <span className="text-sm sm:text-base">Sending OTP...</span>
          </>
        ) : (
          <span className="text-sm sm:text-base">Send Email OTP</span>
        )}
      </button>

      {/* Footer */}
      <div className="mt-6 sm:mt-8 pt-6 border-t border-gray-200">
        <p className="text-xs sm:text-sm text-gray-500 text-center">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Login here
          </a>
        </p>
      </div>
    </form>
  );
}
