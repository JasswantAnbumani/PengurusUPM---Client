import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Sling as Hamburger } from "hamburger-react"; // npm install hamburger-react
import "../index.css";
import { motion } from "framer-motion"; // npm install framer-motion

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 520);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 520);
      if (window.innerWidth > 520) {
        setIsOpen(false); // reset menu saat kembali ke desktop
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <nav className="navbar">
        {" "}
        {isMobile && (
          <Hamburger
            toggled={isOpen}
            toggle={setIsOpen}
            className="hamburger-icon"
          />
        )}
        <div className="navbar-header">
          <h1 className="navbar-title">Pengurus Chess Club</h1>
          {!isMobile && (
            <div className="nav-links desktop">
              <NavLink to="/" end className="nav-link">
                Home
              </NavLink>
              <NavLink to="/anggota" className="nav-link">
                Daftar Anggota
              </NavLink>
              <NavLink to="/absensi" className="nav-link">
                Absensi
              </NavLink>
              <NavLink to="/uangkas" className="nav-link">
                Uang Kas
              </NavLink>
            </div>
          )}
        </div>
        {/* Mobile menu dropdown */}
        {isMobile && (
          <div className="hamburger-wrapper">
            <div className={`nav-links ${isOpen ? "active" : ""}`}>
              <NavLink
                to="/"
                end
                className="nav-link"
                onClick={() => setIsOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/anggota"
                className="nav-link"
                onClick={() => setIsOpen(false)}
              >
                Daftar Anggota
              </NavLink>
              <NavLink
                to="/absensi"
                className="nav-link"
                onClick={() => setIsOpen(false)}
              >
                Absensi
              </NavLink>
              <NavLink
                to="/uangkas"
                className="nav-link"
                onClick={() => setIsOpen(false)}
              >
                Uang Kas
              </NavLink>
            </div>
          </div>
        )}
      </nav>
    </motion.header>
  );
}
