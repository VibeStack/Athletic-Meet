// components/Register/RegisterPage.jsx
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Step1AccountForm from "./Step1AccountForm";
import Step2EmailOtp from "./Step2EmailOtp";
import Step3PersonalDetails from "./Step3PersonalDetails";
import Step4Success from "./Step4Success";

export default function RegisterPage() {
  const methods = useForm({
    mode: "onChange",
  });
  const [step, setStep] = useState(4);

  const nextStep = (increment = 1) => setStep((s) => s + increment);

  const onSubmit = () => {
    nextStep();
  };

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen flex flex-col justify-center items-center bg-linear-to-br from-blue-50 via-white to-indigo-50 px-4 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-20"></div>

        <div className="relative z-10 w-full max-w-xl">
          {step < 4 ? (
            <>
              {step === 1 && (
                <Step1AccountForm nextStep={nextStep} setStep={setStep} />
              )}
              {step === 2 && <Step2EmailOtp nextStep={nextStep} />}
              {step === 3 && (
                <Step3PersonalDetails
                  nextStep={nextStep}
                  onSubmit={methods.handleSubmit(onSubmit)}
                />
              )}
            </>
          ) : (
            <Step4Success />
          )}
        </div>
      </div>
    </FormProvider>
  );
}
