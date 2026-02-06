import React, { useState } from "react";
import { useForm } from "react-hook-form";
import InputField from "./InputField.jsx";
import TextAreaField from "./TextAreaField.jsx";
import { MapPin, Mail, Send } from "../../icons/index.jsx";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Contact = ({ darkMode }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [isSending, setIsSending] = useState(false);
  const onSubmit = async (data) => {
    if (isSending) return; // prevent double submit

    setIsSending(true);

    try {
      await emailjs.send(
        "service_4tvqwrq",
        "template_c5o3rpg",
        {
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: data.message,
          time: new Date().toLocaleString(),
        },
        "jRMbQjRPMDA4PVvUv",
      );

      toast.success("Message sent successfully! ✅");
      reset();
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message. Please try again ❌");
    } finally {
      setIsSending(false); // always stop loading
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <section
        id="contact"
        className={`py-14 sm:py-16 ${
          darkMode ? "bg-gray-900" : "bg-linear-to-b from-white to-gray-50/50"
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span
              className={`inline-block px-5 py-2 rounded-full font-semibold text-sm mb-4 ${
                darkMode
                  ? "bg-orange-500/15 text-orange-300"
                  : "bg-orange-100 text-orange-600"
              }`}
            >
              👋 Reach Out
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-linear-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              Get in Touch
            </h2>

            <p
              className={`mt-3 text-base sm:text-lg max-w-xl mx-auto leading-relaxed ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Have questions about registration, events, or participation?
              <br />
              <span className={darkMode ? "text-gray-500" : "text-gray-500"}>
                Our team is here to help you every step of the way.
              </span>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            <div className="lg:col-span-2 space-y-5">
              <div className="text-center lg:text-left">
                <h3
                  className={`text-xl font-bold mb-3 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Let's Connect
                </h3>
                <p
                  className={`text-sm leading-relaxed max-w-xs mx-auto lg:mx-0 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Whether you're looking to register for events, need assistance
                  with your account, or have any questions about the athletic
                  meet, our team is ready to assist you.
                </p>
              </div>

              <div
                className={`flex items-start gap-4 p-5 rounded-xl transition-all duration-300 ${
                  darkMode
                    ? "bg-gray-800/80 hover:bg-gray-800 shadow-lg shadow-black/20"
                    : "bg-white border border-gray-100 shadow-md hover:shadow-lg"
                }`}
              >
                <div
                  className={`p-2.5 rounded-lg shrink-0 ${
                    darkMode ? "bg-orange-500/20" : "bg-orange-50"
                  }`}
                >
                  <MapPin
                    className={`w-5 h-5 ${
                      darkMode ? "text-orange-400" : "text-orange-500"
                    }`}
                  />
                </div>
                <div>
                  <h4
                    className={`text-base font-bold mb-0.5 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Address
                  </h4>
                  <p
                    className={`text-sm leading-relaxed ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    GNDEC Sports Department, Gill Park, Ludhiana, Punjab —
                    141006
                  </p>
                  <span
                    className={`text-xs ${
                      darkMode ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    Official Athletic Meet Contact
                  </span>
                </div>
              </div>

              <div
                className={`flex items-start gap-4 p-5 rounded-xl transition-all duration-300 ${
                  darkMode
                    ? "bg-gray-800/80 hover:bg-gray-800 shadow-lg shadow-black/20"
                    : "bg-white border border-gray-100 shadow-md hover:shadow-lg"
                }`}
              >
                <div
                  className={`p-2.5 rounded-lg shrink-0 ${
                    darkMode ? "bg-orange-500/20" : "bg-orange-50"
                  }`}
                >
                  <Mail
                    className={`w-5 h-5 ${
                      darkMode ? "text-orange-400" : "text-orange-500"
                    }`}
                  />
                </div>
                <div>
                  <h4
                    className={`text-base font-bold mb-0.5 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Email
                  </h4>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    gndecathletic2026@gmail.com
                  </p>
                  <span
                    className={`text-xs ${
                      darkMode ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    We usually respond within 24 hours
                  </span>
                </div>
              </div>
            </div>

            <div
              className={`lg:col-span-3 p-6 rounded-2xl transition-shadow duration-300 ${
                darkMode
                  ? "bg-gray-800/60 border border-gray-700/50 shadow-xl shadow-black/30"
                  : "bg-white border border-gray-100 shadow-lg hover:shadow-xl"
              }`}
            >
              <h3
                className={`text-xl font-bold mb-5 bg-linear-to-r ${
                  darkMode
                    ? "from-orange-400 to-amber-400"
                    : "from-orange-500 to-amber-600"
                } bg-clip-text text-transparent`}
              >
                Send us a Message
              </h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <InputField
                  label="Full Name"
                  id="name"
                  placeholder="Enter Your Name"
                  register={register}
                  rules={{ required: "Name is required" }}
                  errors={errors}
                  darkMode={darkMode}
                />

                <InputField
                  label="Email Address"
                  id="email"
                  type="email"
                  placeholder="Enter Your Email"
                  register={register}
                  rules={{
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/, message: "Invalid email" },
                  }}
                  errors={errors}
                  darkMode={darkMode}
                />

                <InputField
                  label="Phone Number"
                  id="phone"
                  type="phone"
                  placeholder="Enter Your Phone Number"
                  register={register}
                  errors={errors}
                  darkMode={darkMode}
                />

                <TextAreaField
                  label="Message"
                  id="message"
                  placeholder="Describe your query or issue here..."
                  register={register}
                  rules={{ required: "Message cannot be empty" }}
                  errors={errors}
                  rows="3"
                  darkMode={darkMode}
                />

                <button
                  type="submit"
                  disabled={isSending}
                  className={`mt-10 mb-0 group w-full px-6 py-4 rounded-xl font-semibold text-base text-white overflow-hidden transition-all duration-300 flex items-center justify-center gap-2 ${
                    isSending
                      ? "bg-orange-400 cursor-not-allowed opacity-80"
                      : darkMode
                        ? "bg-orange-500 hover:bg-orange-400 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50"
                        : "bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30"
                  }`}
                >
                  {isSending ? (
                    <>
                      {/* Spinner */}
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
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                      <span className="text-white">Sending...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-white">Send Message</span>
                      <Send className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform duration-200" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 pt-2">
                  <span className="text-base">🔒</span>
                  <p
                    className={`text-sm font-medium ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Your information is safe and never shared
                  </p>
                </div>
              </form>
            </div>
          </div>
          <div
            className={`mt-16 border-t ${
              darkMode ? "border-gray-800" : "border-gray-100"
            }`}
          />
        </div>
      </section>
    </>
  );
};

export default Contact;
