import React, { useState, useEffect } from "react";

const TARGET_DATE = new Date("February 20, 2026").getTime();

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState(null);

  const calculateTimeLeft = () => {
    const diff = TARGET_DATE - Date.now();
    if (diff <= 0) return null;

    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff / 3600000) % 24),
      minutes: Math.floor((diff / 60000) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  useEffect(() => {
    const update = () => {
      setTimeLeft(calculateTimeLeft());
      setTimeout(update, 1000);
    };
    update();
    return () => { };
  }, []);

  if (timeLeft === null) {
    return (
      <div className="animate-pulse text-2xl sm:text-3xl md:text-4xl font-black text-cyan-400 mt-8 tracking-wider uppercase drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
        🎉 Event is Going On! 🎉
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-10 mb-12">
      {Object.entries(timeLeft).map(([label, value]) => (
        <div key={label} className="flex flex-col items-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center shadow-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-linear-to-br from-cyan-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
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
