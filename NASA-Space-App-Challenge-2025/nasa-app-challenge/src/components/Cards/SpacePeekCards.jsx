import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SpacePeekCards = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState('next');


  const navigate = useNavigate();

  const planets = [
    {
      id: 1,
      name: "Mercury",
      color: "bg-gray-400",
      imageUrl:
        "https://assets.science.nasa.gov/dynamicimage/assets/science/psd/solar-system/mercury/images/mercury_as_mariner_10_sped_away_March_29_1974_PIA02418.jpg?w=775&h=1023&fit=clip&crop=faces%2Cfocalpoint",
      distance: "57.9 million km from Sun",
      diameter: "4,880 km",
      type: "Terrestrial Planet",
      daylength: "58.6 Earth days",
      yearlength: "88 Earth days",
    },
  ];

  const handleNext = () => {
    setDirection("next");
    setCurrentIndex((prev) => (prev + 1) % planets.length);
  };

  const handlePrev = () => {
    setDirection("prev");
    setCurrentIndex((prev) => (prev - 1 + planets.length) % planets.length);
  };
      const handleClick = () => {
    navigate("/explore");
  };

  const currentPlanet = planets[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#030B2A] to-[#07173F] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Explore Planets</h1>
          <p className="text-gray-300">Discover the wonders of our solar system</p>
        </div>

        {/* Card Container */}
        <div className="relative overflow-hidden">
          <div
            key={currentIndex}
            className={`rounded-2xl shadow-2xl p-8 transform transition-all duration-500
            bg-[rgba(255,255,255,0.05)] backdrop-blur-md border border-white/10
            ${direction === "next" ? "animate-slideInRight" : "animate-slideInLeft"}
          `}
          >
            {/* Planet Image */}
            <div className="flex justify-center mb-6">
              <img
                src={currentPlanet.imageUrl}
                alt={currentPlanet.name}
                className="w-40 h-40 rounded-full shadow-lg object-cover animate-rotatePlanet"
              />
            </div>

            {/* Planet Name */}
            <h2 className="text-3xl font-bold text-white text-center mb-4">
              {currentPlanet.name}
            </h2>

            {/* Planet Info */}
            <div className="space-y-3 mb-6 text-gray-200">
              <div className="flex justify-between py-2 border-b border-white/10">
                <span className="font-medium">Distance from Sun</span>
                <span>{currentPlanet.distance}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/10">
                <span className="font-medium">Diameter</span>
                <span>{currentPlanet.diameter}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/10">
                <span className="font-medium">Type</span>
                <span>{currentPlanet.type}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/10">
                <span className="font-medium">Day Length</span>
                <span>{currentPlanet.daylength}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/10">
                <span className="font-medium">Year Length</span>
                <span>{currentPlanet.yearlength}</span>
              </div>
            </div>

            {/* Explore Button */}
            <button  onClick={handleClick} className="w-full bg-[#0B3B91] hover:bg-[#1E56D9] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg">
              Explore Now
            </button>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={handlePrev}
            className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Progress Indicators */}
          <div className="flex gap-2">
            {planets.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "w-8 bg-white" : "w-2 bg-white/40"
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Planet Counter */}
        <div className="text-center mt-6 text-gray-300 text-sm">
          Planet {currentIndex + 1} of {planets.length}
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes rotatePlanet {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .animate-slideInRight {
          animation: slideInRight 0.5s ease-out;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.5s ease-out;
        }

        .animate-rotatePlanet {
          animation: rotatePlanet 25s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default SpacePeekCards;
