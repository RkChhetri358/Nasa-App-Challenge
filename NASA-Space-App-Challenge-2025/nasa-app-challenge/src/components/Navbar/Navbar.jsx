import React, { useState,useEffect } from "react";
import "./Navbar.css";
import { Link } from 'react-router-dom';

const Navbar = () => {

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);



  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`} style={{ position: "sticky", top: 0, zIndex: 1000 }}>
      <div className="logo">Embiggen Your Eyes!</div>
      
      <ul className={menuOpen ? "nav-links active" : "nav-links"} style={{ paddingRight: "20px" ,paddingTop:"10px", fontSize:"18px" }}>
        <li><Link to="/">Home</Link></li>
        <li><a href="#">About</a></li>
      
        <li><a href="#">Contact</a></li>
        <li><Link to='/explore'>Explore</Link></li>
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
