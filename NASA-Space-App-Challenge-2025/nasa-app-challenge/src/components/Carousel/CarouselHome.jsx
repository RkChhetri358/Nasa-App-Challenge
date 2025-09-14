import React, { useState, useEffect } from "react";
import "./CarouselHome.css";

const images = [
    "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&w=1600&h=700",
"https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&w=1600&h=700",
"https://images.unsplash.com/photo-1454789548928-9efd52dc4031?auto=format&w=1600&h=700",


 
];


const CarouselHome = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);



  return (
 <div className="hero-carousel">
      {images.map((img, index) => (
        <div
          className={`slide ${index === current ? "active" : ""}`}
          key={index}
          style={{ backgroundImage: `url(${img})` }}
        ></div>
      ))}

      <div className="overlay">
        <h1>Embiggen Your Eyes!</h1>
        <p>Explore breathtaking visuals</p>
      </div>
    </div>
  );
};

export default CarouselHome;
