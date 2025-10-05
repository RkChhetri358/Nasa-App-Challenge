

import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h2 className="mb-4">Embiggen Your Eyes</h2>
        <p>© 2025 All Rights Reserved</p>
        <p className="mb-4">NASA Space App Challenge 2025</p>
        <div className="links">
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Explore</a>
        </div>
        
      </div>

      {/* Space elements */}
      {/* <div className="stars"></div>
      <div className="planet planet1"></div>
      <div className="planet planet2"></div> */}
    </footer>
  );
};

export default Footer;
