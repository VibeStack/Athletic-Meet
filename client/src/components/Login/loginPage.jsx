import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Step1Credentials from "./Step1Credentials";
import Step2LoginSuccess from "./Step2LoginSuccess";

export default function LoginPage() {
  const methods = useForm({
    mode: "onChange",
  });
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((s) => s + 1);

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen flex flex-col justify-center items-center bg-linear-to-br from-blue-50 via-white to-indigo-50 px-4 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-20"></div>

        <div className="relative z-10 w-full max-w-md">
          {step === 1 && <Step1Credentials nextStep={nextStep} />}
          {step === 2 && <Step2LoginSuccess />}
        </div>
      </div>
    </FormProvider>
  );
}
