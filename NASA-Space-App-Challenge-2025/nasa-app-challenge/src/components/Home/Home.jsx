// import React, { useEffect, useState } from "react";
// import AOS from "aos";


// import CarouselHome from "../Carousel/CarouselHome";


// const Home = () => {




//   return (
//     <>
//       <div className="caurosel">
//         <CarouselHome />
//       </div>
      
    

     
//     </>
//   );
// };

// export default Home;
import React from "react";
import "./Home.css";
import { FaGlobeAmericas } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate("/explore");
  };

  return (
    <div className="home">
      <div className="starfield">
        {[...Array(50)].map((_, i) => (
          <div key={i} className="star"></div>
        ))}
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen pt-20 relative z-10">
        <div className="text-center">
          <h1 className="text-9xl text-white font-extrabold">EMBIGGEN</h1>
          <h1 className="text-9xl font-extrabold text-blue-800 tracking-tight">
            YOUR EYES
          </h1>
          <p className="text-4xl text-white mt-4">
            Explore The Solar System Now
          </p>
        </div>

        <button
          className="mt-12 px-8 py-3 rounded-full bg-[linear-gradient(to_right,rgba(30,64,175,0.35),rgba(30,58,138,0.35),rgba(30,64,175,0.35))] border border-blue-300 flex items-center justify-center gap-3 text-white font-mono text-xl shadow-md shadow-blue-900/20 transition-transform duration-200 hover:scale-105 hover:border-blue-400 hover:shadow-blue-300/40 hover:ring-2 hover:ring-blue-300"
          onClick={handleExploreClick}
        >
          <FaGlobeAmericas className="text-2xl mr-2" />
          <span>Start Exploring</span>
        </button>
      </div>
    </div>
  );
}

export default Home;