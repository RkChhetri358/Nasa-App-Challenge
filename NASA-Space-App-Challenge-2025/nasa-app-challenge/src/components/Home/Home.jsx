import React from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate("/SpacePeekCards");
  };

  return (
    <div className="home-container">
      <section className="hero">
        <div className="hero-bg bg1 active"></div>
        <div className="hero-bg bg2"></div>

        <div className="container">
          <div className="hero-content">
            <h1>EXPLORE NASA'S MASSIVE IMAGES</h1>
            <p>
              Zoom into 2.5 Billion Pixel Space Images with our revolutionary
              platform designed to handle datasets that break conventional tools.
            </p>

            <button className="cta-button" onClick={handleExploreClick}>
              Start Exploring NASA Data
            </button>

            <div className="data-scale-indicator">
              <div className="scale-item">
                <span className="number">10M</span>
                <span className="label">Your Eye Pixels</span>
              </div>
              <div className="arrow">→</div>
              <div className="scale-item">
                <span className="number">2.5B</span>
                <span className="label">Hubble Gigapixel Images</span>
              </div>
              <div className="arrow">→</div>
              <div className="scale-item">
                <span className="number">10T+</span>
                <span className="label">Seamless Zoom & Compare</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
