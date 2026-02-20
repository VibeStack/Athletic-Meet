import React, { useState, useEffect, useRef } from "react";

const TARGET_DATE = new Date("February 19, 2026").getTime();
const END_DATE = TARGET_DATE + 2 * 24 * 60 * 60 * 1000; // 2 days later

const CountdownTimer = () => {
  const [timeState, setTimeState] = useState("countdown"); // "countdown" | "ongoing" | "completed"
  const [timeLeft, setTimeLeft] = useState(null);
  const timeoutRef = useRef(null);

  const calculateTimeLeft = () => {
    const now = Date.now();
    if (now >= END_DATE) return "completed";
    if (now >= TARGET_DATE) return "ongoing";

    const diff = TARGET_DATE - now;
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff / 3600000) % 24),
      minutes: Math.floor((diff / 60000) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  useEffect(() => {
    const update = () => {
      const result = calculateTimeLeft();
      if (result === "completed") {
        setTimeState("completed");
        setTimeLeft(null);
      } else if (result === "ongoing") {
        setTimeState("ongoing");
        setTimeLeft(null);
        timeoutRef.current = setTimeout(update, 60000); // check less frequently
      } else {
        setTimeState("countdown");
        setTimeLeft(result);
        timeoutRef.current = setTimeout(update, 1000);
      }
    };
    update();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (timeState === "completed") {
    return (
      <div className="flex flex-col items-center justify-center mt-8 mb-4">
        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-cyan-400 tracking-wider text-center drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] leading-relaxed">
          ✨ Event Successfully Completed! ✨
        </div>
        <p className="text-sm sm:text-base text-cyan-100 mt-2 tracking-wide text-center uppercase">
          Stay tuned! Dates for next year will be revealed soon.
        </p>
      </div>
    );
  }

  if (timeState === "ongoing") {
    return (
      <div className="animate-pulse text-2xl sm:text-3xl md:text-4xl font-black text-cyan-400 mt-8 mb-4 tracking-wider uppercase drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] text-center">
        🥳 Join Us - The Event Is On! 🥳
      </div>
    );
  }

  if (!timeLeft) return null;

  return (
    <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-10 mb-12">
      {Object.entries(timeLeft).map(([label, value]) => (
        <div key={label} className="flex flex-col items-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center shadow-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-linear-to-br from-cyan-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity "></div>
            <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white relative z-10 font-mono">
              {value.toString().padStart(2, "0")}
            </span>
          </div>
          <span className="text-xs sm:text-sm text-cyan-200 uppercase tracking-widest mt-2 font-semibold">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
