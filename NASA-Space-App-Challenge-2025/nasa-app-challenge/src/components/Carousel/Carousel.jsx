import React, { useState, useEffect } from "react";
import "./Carousel.css";

const images = [
  "https://picsum.photos/id/1015/800/400",
  "https://picsum.photos/id/1016/800/400",
  "https://picsum.photos/id/1018/800/400",
  "https://picsum.photos/id/1020/800/400",
];

const Carousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(interval);
  }, [current]);

  const nextSlide = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="carousel">
      <div className="carousel-inner">
        {images.map((img, index) => (
          <div
            className={`carousel-item ${index === current ? "active" : ""}`}
            key={index}
          >
            <img src={img} alt={`Slide ${index}`} />
          </div>
        ))}
      </div>

      <button className="prev" onClick={prevSlide}>&#10094;</button>
      <button className="next" onClick={nextSlide}>&#10095;</button>

      <div className="dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={index === current ? "dot active" : "dot"}
            onClick={() => setCurrent(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
