import React from "react";
import { useNavigate } from "react-router-dom";
import galleryImages from "../../Data/landingPageImages.json";

const Gallery = ({ darkMode }) => {
  const navigate = useNavigate();

  return (
    <section
      id="gallery"
      className={`py-16 sm:py-20 md:py-24 ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <span className="inline-block px-4 py-2 bg-pink-500/10 rounded-full text-pink-500 font-semibold text-sm mb-4">
            📸 Memories
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 bg-linear-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
            Gallery
          </h2>
          <p
            className={`text-lg sm:text-xl ${
              darkMode ? "text-gray-400" : "text-gray-600"
            } max-w-2xl mx-auto mb-2`}
          >
            Moments of Glory and Determination
          </p>
          <p
            className={`text-sm ${
              darkMode ? "text-gray-500" : "text-gray-500"
            } max-w-xl mx-auto`}
          >
            Captured moments from real athletes, real competition, and real
            victories
          </p>
        </div>

        {/* Row 1: Featured Image (Full Width) */}
        <div className="mb-4 sm:mb-5">
          {galleryImages
            .filter((img) => img.featured)
            .map((img, idx) => (
              <div
                key={`featured-${idx}`}
                className="relative overflow-hidden rounded-2xl group cursor-pointer aspect-4/5 sm:aspect-3/2 lg:aspect-4/3"
              >
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  style={{ objectPosition: "center 25%" }}
                />
                <div className="absolute top-3 left-3 z-10">
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md ${
                      darkMode
                        ? "bg-black/60 text-white"
                        : "bg-white/90 text-gray-800 shadow-sm"
                    }`}
                  >
                    {img.badge}
                  </span>
                </div>
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent flex flex-col items-start justify-end p-5 opacity-100">
                  <p className="text-white font-bold text-xl sm:text-2xl mb-1">
                    {img.title}
                  </p>
                  <p className="text-gray-300 text-sm">Athletic Meet 2024</p>
                </div>
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-white/30 transition-all duration-500" />
              </div>
            ))}
        </div>

        {/* Row 2: 3 Images */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-4 sm:mb-5">
          {galleryImages
            .filter((img) => !img.featured)
            .slice(0, 3)
            .map((img, idx) => (
              <div
                key={`row2-${idx}`}
                className="relative overflow-hidden rounded-2xl group cursor-pointer aspect-4/5"
              >
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  style={{ objectPosition: "center" }}
                />
                <div className="absolute top-3 left-3 z-10">
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md ${
                      darkMode
                        ? "bg-black/60 text-white"
                        : "bg-white/90 text-gray-800 shadow-sm"
                    }`}
                  >
                    {img.badge}
                  </span>
                </div>
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent flex flex-col items-start justify-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <p className="text-white font-bold text-lg mb-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {img.title}
                  </p>
                  <p className="text-gray-300 text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                    Athletic Meet 2024
                  </p>
                </div>
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-white/30 transition-all duration-500" />
              </div>
            ))}
        </div>

        {/* Row 3: 2 Images (Centered) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mx-auto">
          {galleryImages
            .filter((img) => !img.featured)
            .slice(3, 5)
            .map((img, idx) => (
              <div
                key={`row3-${idx}`}
                className="relative overflow-hidden rounded-2xl group cursor-pointer aspect-4/5"
              >
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  style={{ objectPosition: "center" }}
                />
                <div className="absolute top-3 left-3 z-10">
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md ${
                      darkMode
                        ? "bg-black/60 text-white"
                        : "bg-white/90 text-gray-800 shadow-sm"
                    }`}
                  >
                    {img.badge}
                  </span>
                </div>
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent flex flex-col items-start justify-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <p className="text-white font-bold text-lg mb-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {img.title}
                  </p>
                  <p className="text-gray-300 text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                    Athletic Meet 2024
                  </p>
                </div>
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-white/30 transition-all duration-500" />
              </div>
            ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => navigate("/gallery")}
            className="group relative px-8 py-4 bg-linear-to-r from-pink-500 to-orange-500 text-white rounded-full font-bold text-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
          >
            <span className="relative z-10">
              Explore All Event Highlights →
            </span>
            <div className="absolute inset-0 bg-linear-to-r from-orange-500 to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
          </button>
          <p
            className={`text-xs mt-3 ${
              darkMode ? "text-gray-500" : "text-gray-400"
            }`}
          >
            Photos from multiple events and competitions
          </p>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
