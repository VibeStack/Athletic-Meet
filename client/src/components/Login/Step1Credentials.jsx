import React, { useRef, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import InputField from "./InputField";

export default function Step1Credentials({ nextStep }) {
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useFormContext();

  const onSubmit = async (data) => {
    try {
      const response = await login(data);

      if (response.success && response.message === "Login successful!") {
        alert("✅ Login successful!");
        nextStep();
      } else {
        alert(response.data?.message || "Login failed. Please try again.");
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data?.message || "Invalid credentials.");
      } else {
        alert("Server error. Please check your internet connection.");
      }

      reset({ username: "", email: "", password: "" });
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl w-full max-w-md p-6 sm:p-8 md:p-10 mx-auto border border-white/50 transition-transform "
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
          Login In Your Credentials
        </h3>

        <div className="space-y-4 pb-1">
          {/* <InputField
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
          /> */}

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
            placeholder="Enter Your Password"
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

        {/* Submit Button - Matching website design */}
        <button
          type="submit"
          className={`w-full mt-2 py-4 px-4
            bg-linear-to-r from-cyan-500 via-blue-500 to-purple-500
            text-white font-bold rounded-xl shadow-lg
            hover:shadow-xl focus:outline-none focus:ring-0
            transition-transform  flex items-center justify-center gap-2
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
              <span className="text-sm sm:text-base">Logging in...</span>
            </>
          ) : (
            <>
              <span className="text-sm sm:text-base">Login</span>
            </>
          )}
        </button>

        {/* Footer */}
        <div className="mt-6 sm:mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm sm:text-base text-gray-500 text-center">
            Don't have an account?{" "}
            <a
              href="/register"
              className="font-semibold
                bg-linear-to-r from-cyan-500 via-blue-500 to-purple-500
                bg-clip-text text-transparent
                hover:opacity-80 transition-opacity "
            >
              Create one
            </a>
          </p>
        </div>
      </form>
    </>
  );
}
