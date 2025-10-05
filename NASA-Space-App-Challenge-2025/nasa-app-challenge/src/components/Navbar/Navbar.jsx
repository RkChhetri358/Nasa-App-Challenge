import React, { useState,useEffect } from "react";
import "./Navbar.css";
import { Link } from 'react-router-dom';
import { FaHome } from "react-icons/fa";
import { IoTelescope } from "react-icons/io5"; // <-- Add this import
import { IoMdInformationCircleOutline } from "react-icons/io";

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
    // <nav className={`navbar ${scrolled ? "scrolled" : ""}`} style={{ position: "sticky", top: 0, zIndex: 1000 }}>
    //   <div className="logo">Embiggen Your Eyes!</div>
      
    //   <ul className={menuOpen ? "nav-links active" : "nav-links"} style={{ paddingRight: "20px" ,paddingTop:"10px", fontSize:"18px" }}>
    //     <li><Link to="/">Home</Link></li>
    //     <li><a href="#">About</a></li>
      
    //     <li><a href="#">Contact</a></li>
    //     <li><Link to='/explore'>Explore</Link></li>
    //   </ul>

    //   <div className={menuOpen ? "hamburger toggle" : "hamburger"} onClick={toggleMenu}>
    //     <div></div>
    //     <div></div>
    //     <div></div>
    //   </div>
    // </nav>
    <nav className="navbar" style={{ position: "relative", overflow: "hidden" }}>
            {/* Starfield background */}
            <div className="starfield-navbar">
                {[...Array(30)].map((_, i) => (
                    <div key={i} className="star-navbar"></div>
                ))}
            </div>
            <div className="navbar-container" style={{ position: "relative", zIndex: 2 }}>
                <div className="navbar-brand">
                    <h1 className="embiggen text-2xl font-extrabold" style={{ color: "#3b82f6", fontWeight: "bold" }}>
                       <Link to="/"> Embiggen <span style={{ marginLeft: "0.3em", fontWeight: "bold", color: "white" }}>Your Eyes</span> </Link>
                    </h1>
                </div>
                <ul className="navbar-list">
                    <li className="navbar-item "><Link to="/" style={{ color: "inherit", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5em" }}
                    > <FaHome className="mr-2"/>Home</Link></li>
                    <li className="navbar-item "><Link to='/SpacePeekCards' style={{ color: "inherit", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5em" }}>
                    <IoTelescope className="mr-2" />Explore</Link></li>
                    <li className="navbar-item "><Link to='/about' style={{ color: "inherit", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5em" }}>
                    <IoMdInformationCircleOutline className="mr-2" />About Us</Link></li>
                </ul>
            </div>
        </nav>
  );
};

export default Navbar;
