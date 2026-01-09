import React from "react";
import { useNavigate } from "react-router-dom";

const Gallery = ({ darkMode }) => {
  const navigate = useNavigate();
  const galleryImages = [
    {
      url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop",
      title: "Ready to Race",
      badge: "🏁 Starting Line",
      featured: true,
    },
    {
      url: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&h=400&fit=crop",
      title: "Morning Training",
      badge: "⚡ Peak Action",
    },
    {
      url: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&h=400&fit=crop",
      title: "The Chase",
      badge: "🔥 Competition",
    },
    {
      url: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&h=400&fit=crop",
      title: "Building Strength",
      badge: "💪 Preparation",
    },
    {
      url: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=600&h=400&fit=crop",
      title: "Final Sprint",
      badge: "🏆 Winning Moment",
    },
    {
      url: "https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?w=600&h=400&fit=crop",
      title: "Power & Focus",
      badge: "🎯 Determination",
    },
  ];

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {galleryImages.map((img, idx) => (
            <div
              key={idx}
              className={`relative overflow-hidden rounded-2xl group cursor-pointer ${
                img.featured
                  ? "sm:col-span-2 lg:row-span-2 aspect-[4/3] lg:aspect-auto"
                  : "aspect-[4/3]"
              }`}
            >
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
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

              <div
                className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col items-start justify-end p-5 transition-opacity duration-500 ${
                  img.featured
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                }`}
              >
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
