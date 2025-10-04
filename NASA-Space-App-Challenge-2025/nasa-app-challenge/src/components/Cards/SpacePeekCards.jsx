import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

const SpacePeekCards = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState('next');

  const planets = [
    {
      id: 1,
      name: "Mercury",
      description: "The smallest and fastest planet in our solar system, Mercury completes an orbit around the Sun every 88 days.",
      distance: "57.9 million km from Sun",
      diameter: "4,879 km",
      color: "bg-gray-400",
      imageUrl:"https://assets.science.nasa.gov/dynamicimage/assets/science/psd/solar-system/mercury/images/messenger_high_resolution_view_of_mercury_pia_13840.jpg?w=4575&h=4575&fit=clip&crop=faces%2Cfocalpoint"
    },
    {
      id: 2,
      name: "Venus",
      description: "The hottest planet in our solar system with a thick toxic atmosphere and surface temperatures hot enough to melt lead.",
      distance: "108.2 million km from Sun",
      diameter: "12,104 km",
      color: "bg-orange-300"
    },
    
    {
      id: 3,
      name: "Mars",
      description: "The Red Planet, known for its rusty color caused by iron oxide. Mars has the largest volcano and canyon in the solar system.",
      distance: "227.9 million km from Sun",
      diameter: "6,779 km",
      color: "bg-red-500"
    },
    {
      id: 4,
      name: "Moon",
      description: "The largest planet in our solar system, a gas giant with a massive storm called the Great Red Spot that's been raging for centuries.",
      distance: "778.5 million km from Sun",
      diameter: "139,820 km",
      color: "bg-amber-600"
    },
    {
      id: 5,
      name: "Phobos",
      description: "Famous for its spectacular ring system made of ice and rock particles. Saturn is the second-largest planet in our solar system.",
      distance: "1.43 billion km from Sun",
      diameter: "116,460 km",
      color: "bg-yellow-600"
    },
    {
      id: 6,
      name: "Uranus",
      description: "An ice giant that rotates on its side, making it unique among all the planets. It has a pale blue-green color.",
      distance: "2.87 billion km from Sun",
      diameter: "50,724 km",
      color: "bg-cyan-400"
    },
    {
      id: 7,
      name: "Neptune",
      description: "The windiest planet in our solar system, with supersonic winds. Neptune is the farthest planet from the Sun.",
      distance: "4.50 billion km from Sun",
      diameter: "49,244 km",
      color: "bg-blue-700"
    }
  ];

  const handleNext = () => {
    setDirection('next');
    setCurrentIndex((prev) => (prev + 1) % planets.length);
  };

  const handlePrev = () => {
    setDirection('prev');
    setCurrentIndex((prev) => (prev - 1 + planets.length) % planets.length);
  };

  const currentPlanet = planets[currentIndex];

  return (
    <div className="min-h-screen bg-[#07173F] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Explore Planets</h1>
          <p className="text-gray-300">Discover the wonders of our solar system</p>
        </div>

        {/* Card Container with sliding animation */}
        <div className="relative overflow-hidden">
          <div
            key={currentIndex}
            className={`bg-white rounded-2xl shadow-2xl p-8 transform transition-all duration-500 ${
              direction === 'next' 
                ? 'animate-slideInRight' 
                : 'animate-slideInLeft'
            }`}
          >
            {/* Planet Visual */}
            <div className="flex justify-center mb-6">
              <img
              src={currentPlanet.imageUrl}
                alt={currentPlanet.name}      // e.g., "Mercury"
                className="w-32 h-32 rounded-full shadow-lg object-cover"
              />
            </div>

            {/* Planet Name */}
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
              {currentPlanet.name}
            </h2>

            {/* Planet Info */}
            {/* Comment */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Distance from Sun</span>
                <span className="text-gray-900 font-semibold">{currentPlanet.distance}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Diameter</span>
                <span className="text-gray-900 font-semibold">{currentPlanet.diameter}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed mb-8">
              {currentPlanet.description}
            </p>

            {/* Explore Button */}
            <button className="w-full bg-[#07173F] hover:bg-[#0a192f] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg">
              Explore Now
            </button>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={handlePrev}
            className="bg-white hover:bg-gray-100 text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Progress Indicators */}
          <div className="flex gap-2">
            {planets.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 bg-white'
                    : 'w-2 bg-white/30'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="bg-white hover:bg-gray-100 text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Planet Counter */}
        <div className="text-center mt-6 text-white text-sm">
          Planet {currentIndex + 1} of {planets.length}
        </div>
      </div>

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

        .animate-slideInRight {
          animation: slideInRight 0.5s ease-out;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SpacePeekCards;