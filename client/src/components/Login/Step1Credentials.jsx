import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import InputField from "./InputField";
import axios from "axios";

export default function Step1Credentials({ nextStep }) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useFormContext();

  const API_URL = import.meta.env.VITE_API_URL;

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, data, {
        withCredentials: true,
      });

      if (response.data.success) {
        toast.success("Welcome back! Login successful 🎉", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });

        setTimeout(() => {
          nextStep();
          navigate("/portal");
        }, 2000);
      } else {
        toast.warning(
          "Incorrect login details. Please check and try again ⚠️",
          {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            theme: "dark",
          }
        );
      }
    } catch (error) {
      if (error.response) {
        toast.error(
          error.response?.data?.error ||
            "Login failed. Please verify your credentials ❌",
          {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            theme: "dark",
          }
        );
      } else {
        toast.error("Network issue detected. Please try again later 🌐", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          theme: "dark",
        });
      }

      reset({ username: "", email: "", password: "" });
    }
  };

  return (
    <>
      <ToastContainer />
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
          Login In Your Credentials
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
          <p className="text-xs sm:text-sm text-gray-500 text-center">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-blue-600 font-semibold hover:underline"
            >
              Create one
            </a>
          </p>
        </div>
      </form>
    </>
  );
}
