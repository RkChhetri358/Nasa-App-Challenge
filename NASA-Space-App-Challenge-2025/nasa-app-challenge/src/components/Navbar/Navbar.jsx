import React, { useState } from "react";
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar" style={{ position: "sticky", top: 0, zIndex: 1000 }}>
      <div className="logo">Embiggen Your Eyes!</div>
      
      <ul className={menuOpen ? "nav-links active" : "nav-links"} style={{ paddingRight: "20px" ,paddingTop:"10px", fontSize:"18px" }}>
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Explore</a></li>
      
        <li><a href="#">Contact</a></li>
      </ul>

      <div className={menuOpen ? "hamburger toggle" : "hamburger"} onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </nav>
  );
};

export default Navbar;
