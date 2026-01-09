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
      Object.entries(mergedData).filter(([key]) => !key.startsWith("otp"))
    );

    try {
      setLoading(true);
      setMessage("Saving your registration details...");

      const response = await axios.post(
        `${API_URL}/user/register`,
        fullUserData
      );

      if (response.data.message === "Registration completed successfully.") {
        setMessage("Registration completed successfully!");
        nextStep();
        const loginResponse = await axios.post(
          `${API_URL}/auth/login`,
          {
            username: getValues("username"),
            email: getValues("email"),
            password: getValues("password"),
          },
          { withCredentials: true }
        );
        if (loginResponse.data.message === "Login successful!") {
          setTimeout(() => {
            navigate("/portal");
          }, 2000);
        }
      }
    } catch (error) {
      setMessage("Failed to complete registration.");
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
        Personal Details
      </h3>

      <div className="space-y-4 pb-1">
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
            options={["Male", "Female", "Other"]}
            register={register}
            rules={{ required: { value: true, message: "Gender is required" } }}
            errors={errors?.gender}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label="Course"
            id="course"
            options={Object.keys(courseBranchMap)}
            register={register}
            rules={{ required: { value: true, message: "Course is required" } }}
            errors={errors?.course}
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
            errors={errors?.branch}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="College Roll Number (CRN)"
            id="crn"
            placeholder="Enter your CRN"
            register={register}
            rules={{ required: { value: true, message: "CRN is required" } }}
            errors={errors}
          />

          <InputField
            label="University Roll Number (URN)"
            id="urn"
            placeholder="Enter your URN"
            register={register}
            rules={{ required: { value: true, message: "URN is required" } }}
            errors={errors}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label="Year"
            id="year"
            options={["1st Year", "2nd Year", "3rd Year", "4th Year"]}
            register={register}
            rules={{ required: { value: true, message: "Year is required" } }}
            errors={errors?.year}
          />

          <InputField
            label="Phone Number"
            id="phone"
            type="text"
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
          />
        </div>
      </div>

      {message && (
        <p
          className={`text-center text-sm mt-4 ${
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

      <div className="flex justify-center items-center mt-6">
        <button
          type="submit"
          className="w-full md:w-auto px-8 py-4 bg-linear-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-0 transition-all duration-300 touch-manipulation disabled:opacity-75"
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
