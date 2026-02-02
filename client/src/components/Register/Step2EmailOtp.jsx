import React, { useRef, useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import axios from "axios";

export default function Step2EmailOtp({ nextStep }) {
  const { register, setValue, handleSubmit, getValues } = useFormContext();
  const otpRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  const handleKeyDown = (e, index) => {
    const key = e.key;

    if (["Tab", "ArrowLeft", "ArrowRight"].includes(key)) return;

    if (/^[0-9]$/.test(key)) {
      e.preventDefault();

      setValue(`otp${index}`, key);
      otpRefs.current[index].value = key;

      if (index < 5) {
        otpRefs.current[index + 1].focus();
        otpRefs.current[index + 1].select?.();
      }
      return;
    }

    if (key === "Backspace") {
      e.preventDefault();
      const current = otpRefs.current[index].value;

      if (current) {
        setValue(`otp${index}`, "");
        otpRefs.current[index].value = "";
        return;
      }

      if (index > 0) {
        setValue(`otp${index - 1}`, "");
        otpRefs.current[index - 1].value = "";
        otpRefs.current[index - 1].focus();
      }
    }
  };

  const handleChange = (e, index) => {
    let value = e.target.value.replace(/\D/g, "").slice(-1);

    setValue(`otp${index}`, value);
    otpRefs.current[index].value = value;

    if (value && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "");
    const digits = paste.slice(0, 6).split("");

    digits.forEach((d, i) => {
      setValue(`otp${i}`, d);
      otpRefs.current[i].value = d;
    });

    if (digits.length < 6) otpRefs.current[digits.length]?.focus();
    else otpRefs.current[5]?.focus();
  };

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const sendOtp = async (isResend = false) => {
    try {
      if (resendTimer > 0) {
        const email = getValues("email");
        if (!email) return alert("Please enter your email first.");

        setLoading(true);
        setMessage(isResend ? "Resending OTP..." : "Sending OTP...");

        await axios.post(
          `${import.meta.env.VITE_API_URL}/otp/registerOtpSender`,
          { email },
        );

        setMessage(
          isResend
            ? "A new OTP has been sent to your email."
            : "OTP sent successfully to your email.",
        );
      } else {
        setMessage(`⏳ You can resend OTP after 2 minutes.`);
      }
    } catch (error) {
      setMessage("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
      setMessage("");
    }
  };

  const onSubmit = async (data) => {
    const email = getValues("email");
    const otp = Array.from({ length: 6 }, (_, i) => data[`otp${i}`]).join("");

    if (otp.length !== 6) {
      setMessage("❌ Please enter all 6 digits of the OTP.");
      return;
    }

    try {
      setLoading(true);
      setMessage("🔄 Verifying OTP...");

      const { data: response } = await axios.post(
        `${import.meta.env.VITE_API_URL}/otp/registerOtpVerifier`,
        { email, otp },
        { withCredentials: true },
      );

      const msg = response?.message;

      // ✅ OTP verified → Step 3
      if (msg === "OTP verified successfully. Please complete your profile!") {
        setMessage("✅ OTP verified successfully!");
        nextStep();
        return;
      }

      // ⚠️ Already verified → Step 3
      if (msg === "OTP already verified or registration completed.") {
        setMessage("⚠️ OTP already verified. Continuing...");
        nextStep();
        return;
      }

      setMessage("⚠️ Unexpected response. Please try again.");
    } catch (error) {
      console.error("OTP Verify Error:", error.response?.data);

      const errMsg = error.response?.data?.message;

      // ❌ Wrong OTP
      if (errMsg === "Invalid OTP") {
        setMessage("❌ Invalid OTP. Please try again.");
        return;
      }

      // ❌ OTP expired
      if (errMsg === "No OTP found. Please request a new one.") {
        setMessage("⏳ OTP expired. Go back and request a new OTP.");
        setTimeout(() => {
          nextStep(-1);
        }, 2000);
        return;
      }

      // ❌ User missing
      if (errMsg === "User not found.") {
        setMessage("❌ User not found. Please restart registration.");
        nextStep(-1)
        return;
      }

      // ⚠️ Already verified
      if (errMsg === "OTP already verified or registration completed.") {
        setMessage("⚠️ OTP already verified. Continuing...");
        nextStep();
        return;
      }

      setMessage("❌ OTP verification failed. Try again.");
    } finally {
      setLoading(false);
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
        Email Verification
      </h3>
      <div className="flex justify-center gap-3 mb-8 relative">
        {Array.from({ length: 6 }).map((_, i) => (
          <input
            key={i}
            maxLength={1}
            inputMode="numeric"
            pattern="[0-9]*"
            {...register(`otp${i}`)}
            ref={(el) => (otpRefs.current[i] = el)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            onChange={(e) => handleChange(e, i)}
            onPaste={handlePaste}
            className="aspect-5/6 w-10 md:w-12 text-center border border-gray-300 rounded-lg text-lg
        focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm font-bold"
          />
        ))}

        {message && (
          <p
            className={`text-center text-sm absolute -bottom-8 ${
              message.includes("success") || message.includes("✅")
                ? "text-green-600"
                : message.includes("Verifying")
                  ? "text-blue-600"
                  : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>

      <div className="flex justify-center items-center mt-10">
        <button
          type="submit"
          className="w-full py-4 px-4 bg-linear-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-0 transition-all duration-300 touch-manipulation disabled:opacity-75"
          disabled={loading}
        >
          <span className="text-sm sm:text-base">
            {loading ? "Verifying..." : "Verify OTP"}
          </span>
        </button>
      </div>
    </form>
  );
}
