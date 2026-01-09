import React from "react";

export const UserIcon = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.6}
        stroke="currentColor"
        className="w-5 h-5"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a8.25 8.25 0 0 1 15 0"
        />
    </svg>
);

export const MailIcon = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.6}
        stroke="currentColor"
        className="w-5 h-5"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.75 7.5v9a2.25 2.25 0 0 1-2.25 2.25H4.5A2.25 2.25 0 0 1 2.25 16.5v-9m19.5 0L12 13.5 2.25 7.5"
        />
    </svg>
);

export const LockIcon = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.6}
        stroke="currentColor"
        className="w-5 h-5"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 10.5V7.5a4.5 4.5 0 0 0-9 0v3m12 0a1.5 1.5 0 0 1 1.5 1.5v7.5a1.5 1.5 0 0 1-1.5 1.5h-15a1.5 1.5 0 0 1-1.5-1.5V12a1.5 1.5 0 0 1 1.5-1.5m12 0h-9"
        />
    </svg>
);

export const CheckIcon = (
    <div className="flex justify-center items-center mb-6">
        <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-green-100 border-4 border-green-500 animate-[pop_0.4s_ease-out] shadow-md">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={3}
                stroke="currentColor"
                className="w-10 h-10 text-green-600 animate-[check_0.5s_ease-out_0.3s_forwards]"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                />
            </svg>
        </div>

        <style>{`
      @keyframes pop {
        0% {
          transform: scale(0);
          opacity: 0;
        }
        80% {
          transform: scale(1.15);
          opacity: 1;
        }
        100% {
          transform: scale(1);
        }
      }

      @keyframes check {
        0% {
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
        }
        100% {
          stroke-dasharray: 48;
          stroke-dashoffset: 0;
        }
      }
    `}</style>
    </div>
);
