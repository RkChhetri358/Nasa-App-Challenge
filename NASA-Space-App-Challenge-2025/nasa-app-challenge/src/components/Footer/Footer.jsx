import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h2>Embiggen</h2>
        <p>© 2025 All Rights Reserved</p>
        <div className="links">
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Projects</a>
          <a href="#">Contact</a>
        </div>
        <div className="social-icons">
          <a href="#"><i className="fab fa-facebook-f"></i></a>
          <a href="#"><i className="fab fa-twitter"></i></a>
          <a href="#"><i className="fab fa-instagram"></i></a>
        </div>
      </div>

      {/* Space elements */}
      <div className="stars"></div>
      <div className="planet planet1"></div>
      <div className="planet planet2"></div>
    </footer>
  );
};

export default Footer;
