import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

const SpacePeekCards = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState('next');

  const planets = [
    {
      id: 1,
      name: "Mercury",
      description: " Mercury is the smallest and fastest planet in our solar system, It completes an orbit around the Sun in every 88 days and the surface temperatures are both extremely hot and cold. Day temperatures reach (430°C) and night temperatures can dip as low as -290°F (-180°C).",
      color: "bg-gray-400",
      imageUrl:"https://assets.science.nasa.gov/dynamicimage/assets/science/psd/solar-system/mercury/images/mercury_as_mariner_10_sped_away_March_29_1974_PIA02418.jpg?w=775&h=1023&fit=clip&crop=faces%2Cfocalpoint"
    },
    {
      id: 2,
      name: "Venus",
      description: "Venus is the hottest planet in our solar system with a thick toxic atmosphere and surface temperatures hot enough to melt lead.It is our nearest planetary neighbor and is often called Earth's twin because of their similar size and mass.",
      distance: "108.2 million km from Sun",
      diameter: "12,104 km",
      color: "bg-orange-300",
      imageUrl:"https://assets.science.nasa.gov/dynamicimage/assets/science/psd/solar-system/venus/images/venus_from_nasa_pioneer_1_orbiter.jpg?w=1852&h=1905&fit=clip&crop=faces%2Cfocalpoint"
    },
    
    {
      id: 3,
      name: "Mars",
      description: "Mars is also known as The Red Planet due to its rusty color caused by the presence of iron oxide. Mars has the largest volcano and canyon in the solar system and it is one of the most explored bodies in our solar system.",
      distance: "227.9 million km from Sun",
      diameter: "6,779 km",
      color: "bg-red-500",
      imageUrl:"https://science.nasa.gov/wp-content/uploads/2024/03/pia04304-mars.jpg"
    },
    {
      id: 4,
      name: "Moon",
      description: "The Moon is Earth's only natural satellite and the fifth largest moon in the solar system. It has a significant impact on Earth, influencing tides and stabilizing our planet's axial tilt.It is the second-brightest object in the sky after the Sun.",
      color: "bg-amber-600",
      imageUrl:"https://images-assets.nasa.gov/image/PIA00405/PIA00405~large.jpg?w=1920&h=1920&fit=clip&crop=faces%2Cfocalpoint"
    },
    // {
    //   id: 5,
    //   name: "Phobos",
    //   description: "Famous for its spectacular ring system made of ice and rock particles. Saturn is the second-largest planet in our solar system.",
    //   distance: "1.43 billion km from Sun",
    //   diameter: "116,460 km",
    //   color: "bg-yellow-600"
    // },
    // {
    //   id: 6,
    //   name: "Uranus",
    //   description: "An ice giant that rotates on its side, making it unique among all the planets. It has a pale blue-green color.",
    //   distance: "2.87 billion km from Sun",
    //   diameter: "50,724 km",
    //   color: "bg-cyan-400"
    // },
    // {
    //   id: 7,
    //   name: "Neptune",
    //   description: "The windiest planet in our solar system, with supersonic winds. Neptune is the farthest planet from the Sun.",
    //   distance: "4.50 billion km from Sun",
    //   diameter: "49,244 km",
    //   color: "bg-blue-700"
    // }
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