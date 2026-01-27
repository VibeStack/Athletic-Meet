import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, Sun, Moon, ArrowLeft } from "../../icons/index.jsx";

const GalleryPage = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  const allImages = [
    {
      url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=600&fit=crop",
      title: "Track Sprint Finals",
    },
    {
      url: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&h=400&fit=crop",
      title: "Long Jump Champions",
    },
    {
      url: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&h=400&fit=crop",
      title: "Victory Celebration",
    },
    {
      url: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&h=400&fit=crop",
      title: "Field Events",
    },
    {
      url: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=600&h=400&fit=crop",
      title: "Team Spirit",
    },
    {
      url: "https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?w=600&h=400&fit=crop",
      title: "Relay Race",
    },
    {
      url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=600&fit=crop",
      title: "Medal Ceremony",
    },
    {
      url: "https://images.unsplash.com/photo-1426927308491-6380b6a9936f?w=600&h=400&fit=crop",
      title: "Starting Blocks",
    },
    {
      url: "https://images.unsplash.com/photo-1502224562085-639556652f33?w=600&h=400&fit=crop",
      title: "High Jump Action",
    },
    {
      url: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&h=400&fit=crop",
      title: "Swimming Heat",
    },
    {
      url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop",
      title: "Track Overview",
    },
    {
      url: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&h=400&fit=crop",
      title: "Crowd Cheering",
    },
  ];

  const ImageCard = ({ image, size = "medium" }) => {
    const sizeClasses = {
      large: "h-48 sm:h-64 md:h-80",
      medium: "h-36 sm:h-44 md:h-52",
      small: "h-28 sm:h-36 md:h-44",
    };

    const showCaption = size === "large";

    return (
      <div
        className={`relative overflow-hidden rounded-2xl group cursor-pointer ${sizeClasses[size]}`}
      >
        <img
          src={image.url}
          alt={image.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-linear-to-br from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {showCaption && (
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <p className="text-white font-semibold text-base sm:text-lg drop-shadow-lg">
              {image.title}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-white"}`}>
      <header
        className={`fixed w-full z-50 backdrop-blur-xl ${
          darkMode ? "bg-gray-900/95 shadow-2xl" : "bg-white/95 shadow-lg"
        } border-b ${darkMode ? "border-gray-800" : "border-gray-100"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/")}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl font-medium text-sm transition-all ${
                  darkMode
                    ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </button>

              <div
                className="flex items-center gap-2 cursor-pointer group"
                onClick={() => navigate("/")}
              >
                <img
                  src={
                    darkMode
                      ? "/images/dark_mode_logo.png"
                      : "/images/light_mode_logo.png"
                  }
                  alt="Logo"
                  className="w-12 h-12 rounded-2xl"
                />
                <span className="font-black text-xl bg-linear-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                  SprintSync
                </span>
              </div>
            </div>

            <div className="absolute left-1/2 -translate-x-1/2 hidden md:block">
              <h1
                className={`text-lg font-bold ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                ✨ See Memories
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  darkMode
                    ? "bg-gray-800 hover:bg-gray-700 text-yellow-400"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                {darkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={() => navigate("/register")}
                className="px-5 py-2.5 rounded-xl font-bold text-white bg-linear-to-r from-cyan-500 via-blue-500 to-purple-500 hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="h-20" />

      <div
        className={`relative overflow-hidden py-10 sm:py-12 ${
          darkMode ? "bg-gray-800" : "bg-linear-to-b from-gray-100 to-white"
        }`}
      >
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-linear(${
                darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"
              } 1px, transparent 1px), linear-linear(90deg, ${
                darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"
              } 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        <div
          className={`absolute top-0 left-1/4 w-72 h-72 ${
            darkMode ? "bg-cyan-500/10" : "bg-cyan-400/20"
          } rounded-full blur-[80px]`}
        />
        <div
          className={`absolute bottom-0 right-1/4 w-64 h-64 ${
            darkMode ? "bg-purple-500/10" : "bg-purple-400/20"
          } rounded-full blur-[80px]`}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-sm border mb-4 ${
              darkMode
                ? "bg-white/5 border-white/10"
                : "bg-white/60 border-gray-200"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
            <span
              className={`text-[10px] font-semibold tracking-[0.15em] uppercase ${
                darkMode ? "text-white/60" : "text-gray-600"
              }`}
            >
              Photo Gallery
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 leading-tight tracking-tight">
            <span className={darkMode ? "text-white" : "text-gray-800"}>
              Moments That{" "}
            </span>
            <span className="bg-linear-to-r from-orange-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
              Define Champions
            </span>
          </h1>

          <p
            className={`text-sm sm:text-base font-light max-w-md mx-auto mb-6 ${
              darkMode ? "text-white/40" : "text-gray-500"
            }`}
          >
            Every sprint, leap, and victory — captured forever.
          </p>

          <div className="flex justify-center gap-3 sm:gap-4">
            {[
              { value: "100+", label: "Photos" },
              { value: "10+", label: "Events" },
              { value: new Date().getFullYear(), label: "Season" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className={`px-4 py-2 rounded-xl border transition-colors duration-300 ${
                  darkMode
                    ? "bg-white/5 border-white/10 hover:bg-white/10"
                    : "bg-white/80 border-gray-200 hover:bg-white shadow-sm"
                }`}
              >
                <div
                  className={`text-lg sm:text-xl font-bold ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  {stat.value}
                </div>
                <div
                  className={`text-[9px] uppercase tracking-widest ${
                    darkMode ? "text-white/40" : "text-gray-500"
                  }`}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="space-y-4">
          <ImageCard image={allImages[0]} size="large" />
          <div className="grid grid-cols-2 gap-4">
            <ImageCard image={allImages[1]} size="medium" />
            <ImageCard image={allImages[2]} size="medium" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <ImageCard image={allImages[3]} size="small" />
            <ImageCard image={allImages[4]} size="small" />
            <ImageCard image={allImages[5]} size="small" />
          </div>
          <ImageCard image={allImages[6]} size="large" />
          <div className="grid grid-cols-2 gap-4">
            <ImageCard image={allImages[7]} size="medium" />
            <ImageCard image={allImages[8]} size="medium" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <ImageCard image={allImages[9]} size="small" />
            <ImageCard image={allImages[10]} size="small" />
            <ImageCard image={allImages[11]} size="small" />
          </div>
        </div>
      </main>

      <footer
        className={`py-6 text-center border-t ${
          darkMode ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white"
        }`}
      >
        <p
          className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}
        >
          © 2026 SprintSync. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default GalleryPage;
