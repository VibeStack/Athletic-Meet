import React, { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import axios from "axios";
import InputField from "./InputField";
import SelectField from "./SelectField";
import { useNavigate } from "react-router-dom";

export default function Step3PersonalDetails({ nextStep }) {
  const {
    register,
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useFormContext();

  const selectedCourse = useWatch({ control, name: "course" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const courseBranchMap = {
    "B.Tech": [
      "Computer Science & Engineering",
      "Information Technology",
      "Electrical Engineering",
      "Mechanical Engineering",
      "Civil Engineering",
      "Electronics & Communication Engineering",
      "Robotics & AI",
    ],
    "M.Tech": [
      "Computer Science & Engineering",
      "Electronics Engineering",
      "Mechanical Engineering",
      "Production Engineering",
      "Geo Technical Engineering",
      "Structural Engineering",
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

  const [branchOptions, setBranchOptions] = useState([]);
  const [isBranchDisabled, setIsBranchDisabled] = useState(true);

  useEffect(() => {
    if (selectedCourse) {
      const branches = courseBranchMap[selectedCourse] || [];
      setBranchOptions(branches);
      setIsBranchDisabled(branches.length === 0);
    } else {
      setBranchOptions([]);
      setIsBranchDisabled(true);
    }
  }, [selectedCourse]);

  const onFormSubmit = async (data) => {
    const API_URL = import.meta.env.VITE_API_URL;

    const baseData = {
      username: getValues("username"),
      email: getValues("email"),
      password: getValues("password"),
    };

    const mergedData = { ...baseData, ...data };

    const fullUserData = Object.fromEntries(
      Object.entries(mergedData).filter(([key]) => !key.startsWith("otp")),
    );

    try {
      setLoading(true);
      setMessage("💾 Saving your registration details...");

      const { data: response } = await axios.post(
        `${API_URL}/user/register`,
        fullUserData,
        { withCredentials: true },
      );

      const msg = response?.message;

      if (msg === "Registration completed successfully") {
        setMessage("✅ Registration completed successfully! Logging you in...");
        nextStep();
        // Automatically logging in after user getting registered
        const { data: loginResponse } = await axios.post(
          `${API_URL}/auth/login`,
          {
            username: getValues("username"),
            email: getValues("email"),
            password: getValues("password"),
          },
          { withCredentials: true },
        );

        if (loginResponse.message === "Login successful!") {
          setMessage("🎉 Login successful! Redirecting...");
          setTimeout(() => navigate("/portal"), 5000);
        }

        return;
      }

      if (msg === "Account already exists") {
        setMessage("⚠️ Account already exists. Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
        return;
      }

      setMessage(`⚠️ ${msg || "Unexpected response. Please try again."}`);
    } catch (error) {
      console.error("Register Error:", error.response?.data);

      const errMsg = error.response?.data?.message || "";

      if (errMsg.includes("E11000") && errMsg.includes("jerseyNumber")) {
        setMessage(
          "⚠️ Jersey number conflict occurred. Please retry registration.",
        );
        return;
      }

      if (errMsg === "Please verify OTP first") {
        setMessage("❌ Please verify your email OTP first.");
        return;
      }

      if (errMsg === "User not found. Please signup first.") {
        setMessage("❌ User not found. Please restart signup.");
        return;
      }

      if (errMsg === "Invalid registration state") {
        setMessage("⚠️ Invalid registration flow. Restart signup.");
        return;
      }

      if (errMsg === "User already has a jersey number") {
        setMessage(
          "⚠️ Registration already completed. Redirecting to login...",
        );
        setTimeout(() => navigate("/login"), 1500);
        return;
      }

      // ❌ Fallback
      setMessage(`❌ ${errMsg || "Failed to complete registration."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl w-full max-w-2xl p-6 sm:p-8 md:p-10 mx-auto border border-white/50 transition-all duration-500"
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
        Personal Details
      </h3>

      <div className="relative space-y-4 pb-1">
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Full Name"
              id="fullname"
              placeholder="Enter your full name"
              register={register}
              rules={{
                required: { value: true, message: "Full name is required" },
              }}
              errors={errors}
            />

            <SelectField
              label="Gender"
              id="gender"
              options={["Male", "Female"]}
              register={register}
              rules={{
                required: { value: true, message: "Gender is required" },
              }}
              errors={errors}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="Course"
              id="course"
              options={Object.keys(courseBranchMap)}
              register={register}
              rules={{
                required: { value: true, message: "Course is required" },
              }}
              errors={errors}
            />

            <SelectField
              label="Branch"
              id="branch"
              options={branchOptions}
              register={register}
              disabled={isBranchDisabled}
              rules={
                !isBranchDisabled
                  ? { required: { value: true, message: "Branch is required" } }
                  : {}
              }
              errors={errors}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="College Roll Number (CRN)"
              id="crn"
              type="tel"
              placeholder="Enter your CRN"
              register={register}
              rules={{
                required: { value: true, message: "CRN is required" },
                pattern: {
                  value: /^\d+$/,
                  message: "CRN must contain only numbers",
                },
              }}
              errors={errors}
              inputMode="numeric"
            />

            <InputField
              label="University Roll Number (URN)"
              id="urn"
              type="tel"
              placeholder="Enter your URN"
              register={register}
              rules={{
                required: { value: true, message: "URN is required" },
                pattern: {
                  value: /^\d+$/,
                  message: "URN must contain only numbers",
                },
              }}
              errors={errors}
              inputMode="numeric"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="Year"
              id="year"
              options={["1st Year", "2nd Year", "3rd Year", "4th Year"]}
              register={register}
              rules={{ required: { value: true, message: "Year is required" } }}
              errors={errors}
            />

            <InputField
              label="Phone Number"
              id="phone"
              type="tel"
              placeholder="Enter 10-digit phone number"
              register={register}
              rules={{
                required: { value: true, message: "Phone number is required" },
                pattern: {
                  value: /^[6-9]\d{9}$/,
                  message: "Enter a valid 10-digit phone number",
                },
              }}
              errors={errors}
              inputMode="numeric"
            />
          </div>
        </div>
        {message && (
          <p
            className={`absolute bottom-0 w-full text-center text-sm ${
              [
                "Registration completed successfully!",
                "Saving your registration details...",
              ].some((txt) => message.includes(txt))
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>

      <div className="flex justify-center items-center mt-2">
        <button
          type="submit"
          className="w-full md:w-auto px-8 py-4
            bg-linear-to-r from-cyan-500 via-blue-500 to-purple-500
            text-white font-bold rounded-xl shadow-lg
            hover:shadow-xl focus:outline-none focus:ring-0
            transition-all duration-300 touch-manipulation
            hover:from-cyan-600 hover:via-blue-600 hover:to-purple-600
            disabled:opacity-75"
          disabled={loading}
        >
          <span className="text-sm sm:text-base">
            {loading ? "Submitting..." : "Finish Registration"}
          </span>
        </button>
      </div>
    </form>
  );
}
