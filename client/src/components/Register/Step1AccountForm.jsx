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
      const { data: response } = await axios.post(
        `${API_URL}/otp/registerOtpSender`,
        data,
        { withCredentials: true },
      );

      const msg = response?.message;
      const extra = response?.data;

      // ✅ Account already exists → Login
      if (msg === "Account already exists. Please log in.") {
        alert("✅ Account already exists. Redirecting to login...");
        navigate("/login");
        return;
      }

      // ✅ Email already verified → Skip OTP → Step 3
      if (msg === "Email already verified. Please complete your profile.") {
        alert("✅ Email verified. Continue completing your profile.");
        setStep(3);
        return;
      }

      // ✅ OTP already exists (NEW FLOW)
      if (msg === "OTP already sent. Please check your email.") {
        const remaining = extra?.remainingMinutes || "a few";
        alert(
          `📩 OTP already sent! Check your email. Valid for ${remaining} minute(s).`,
        );
        nextStep(); // Move to OTP screen
        return;
      }

      // ✅ OTP sent fresh
      if (msg === "OTP sent successfully! Please verify your email.") {
        alert("✅ OTP sent successfully! Enter it to continue.");
        nextStep();
        return;
      }

      alert("⚠️ Unexpected response. Please try again.");
    } catch (error) {
      console.error("OTP Sender Error:", error.response?.data);

      const errMsg = error.response?.data?.message;

      // ❌ Username conflict
      if (errMsg === "Username already taken.") {
        setError("username", {
          type: "manual",
          message: "Username already taken. Choose another.",
        });
        return;
      }

      // ❌ Email conflict
      if (errMsg === "Email already linked to another username.") {
        setError("email", {
          type: "manual",
          message: "This email is already linked to another username.",
        });
        return;
      }

      if (errMsg === "Invalid Credentials.") {
        ["username", "email", "password"].forEach((field) => {
          setError(field, {
            type: "manual",
            message: "Invalid Credentials.",
          });
        });
      } else {
        alert("🌐 Network error. Please try again.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl w-full max-w-md p-6 sm:p-8 md:p-10 mx-auto border border-white/50 transition-all duration-500"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="relative inline-flex items-center justify-center mb-5">
          <div className="absolute inset-0 bg-cyan-200/60 rounded-full blur-2xl"></div>
          <img
            src="/images/gne_logo.png"
            alt="Guru Nanak Dev Engineering College Logo"
            className="h-16 w-16 sm:h-20 sm:w-20 relative z-10 drop-shadow-xl"
          />
        </div>

        <h2
          className="font-black text-xl sm:text-2xl md:text-3xl tracking-tight
               bg-linear-to-r from-cyan-500 via-blue-500 to-purple-500
               bg-clip-text text-transparent"
        >
          Athletic Championship
        </h2>

        <p className="text-sm sm:text-base text-gray-900 mt-1 font-semibold">
          Guru Nanak Dev Engineering College
        </p>
      </div>

      <h3 className="text-base sm:text-lg md:text-xl font-bold text-center mb-6 text-gray-600 tracking-tight">
        Create Your Account
      </h3>

      <div className="space-y-4 pb-1">
        <InputField
          label="Username"
          id="username"
          placeholder="Enter Your New Username"
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
            pattern: {
              value: /^[a-zA-Z0-9_]+$/,
              message: "Only letters, numbers, and underscores (_). No spaces.",
            },
            setValueAs: (v) => v.trim(),
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
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@gndec\.ac\.in$/,
              message: "Valid College Mail must end with @gndec.ac.in",
            },
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
        className={`w-full mt-2 py-4 px-4
          bg-linear-to-r from-cyan-500 via-blue-500 to-purple-500
          text-white font-bold rounded-xl shadow-lg
          hover:shadow-xl focus:outline-none focus:ring-0
          transition-all duration-300 flex items-center justify-center gap-2
          touch-manipulation
          ${
            isSubmitting
              ? "opacity-75 cursor-not-allowed"
              : "hover:from-cyan-600 hover:via-blue-600 hover:to-purple-600"
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
        <p className="text-sm sm:text-base text-gray-500 text-center">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-semibold
             bg-linear-to-r from-cyan-500 via-blue-500 to-purple-500
             bg-clip-text text-transparent
             hover:opacity-80 transition-opacity duration-200"
          >
            Login here
          </a>
        </p>
      </div>
    </form>
  );
}
