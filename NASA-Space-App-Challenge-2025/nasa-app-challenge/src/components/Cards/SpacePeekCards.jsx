import React from "react";
import "./SpaceCards.css";

const images = [
  {
    id: 1084,
    thumb: "https://picsum.photos/id/1084/800/400",
    title: "Nebula Drift",
    desc: "A colorful nebula with billowing clouds of gas and dust."
  },
  {
    id: 1063,
    thumb: "https://picsum.photos/id/1063/800/400",
    title: "Starfield",
    desc: "A dense starfield — millions of distant suns glittering."
  }
];

export default function SpacePeekCards() {
  return (
    <div className="cards-container">
      {images.map((img, index) => (
        <div
          key={img.id}
          className={`card ${index % 2 === 0 ? "card-left" : "card-right"} card-horizontal`}
        >
          <img src={img.thumb} alt={img.title} />
          <div className={`card-content ${index % 2 !== 0 ? 'text-right' : ''}`}>
            <h3>{img.title}</h3>
            <p>{img.desc}</p>
            <button>Explore</button>
          </div>
        </div>
      ))}
    </div>
  );
}
