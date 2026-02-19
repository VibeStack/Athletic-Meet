import React, { useRef, useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import axios from "axios";

export default function Step2EmailOtp({ nextStep }) {
  const { register, setValue, handleSubmit, getValues } = useFormContext();
  const otpRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const timeoutRef = useRef(null);

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
        timeoutRef.current = setTimeout(() => {

        }, 2000);
        return;
      }

      // ❌ User missing
      if (errMsg === "User not found.") {
        setMessage("❌ User not found. Please restart registration.");
        nextStep(-1);
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

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
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
        focus:outline-none focus:ring-2 focus:ring-blue-500  shadow-sm font-bold"
          />
        ))}

        {message && (
          <p
            className={`text-center text-sm absolute -bottom-10 ${
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

      <div className="flex justify-center items-center mt-8">
        <button
          type="submit"
          className={`w-full mt-6 py-4 px-4
          bg-linear-to-r from-cyan-500 via-blue-500 to-purple-500
          text-white font-bold rounded-xl shadow-lg
          hover:shadow-xl focus:outline-none focus:ring-0
          transition-transform  flex items-center justify-center gap-2
          touch-manipulation
          ${
            loading
              ? "opacity-75 cursor-not-allowed"
              : "hover:from-cyan-600 hover:via-blue-600 hover:to-purple-600"
          }`}
          disabled={loading}
        >
          <span className="text-sm sm:text-base">
            {loading ? "Verifying..." : "Verify OTP"}
          </span>
        </button>
      </div>

      {/* Open College Email Button */}
      <div className="mt-4 text-center">
        <p className="text-gray-500 text-xs mb-3">
          Check your college email for the OTP
        </p>
        <a
          href="https://mail.gndec.ac.in/?_task=login"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-xl
            bg-linear-to-r from-cyan-50 via-blue-50 to-purple-50
            border border-blue-200
            text-transparent bg-clip-text font-bold text-sm
            hover:from-cyan-100 hover:via-blue-100 hover:to-purple-100
            hover:border-blue-400 hover:shadow-lg hover:shadow-blue-200/50
            hover:scale-[1.02]
            transition-transform  ease-out"
        >
          <span className="bg-linear-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            <svg
              className="w-5 h-5 text-blue-500 group-hover:text-purple-500  "
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </span>
          <span className="bg-linear-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent font-semibold">
            Open College Email
          </span>
          <svg
            className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform "
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>
    </form>
  );
}
