import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [menuActive, setMenuActive] = useState(false);

  const toggleMenu = () => setMenuActive(!menuActive);

  return (
    <nav className="navbar">
      <div className="logo">ReRunsoft</div>
      <button className="menu-toggle" onClick={toggleMenu}>
        &#9776; {/* Hamburger Icon */}
      </button>
      <ul className={`nav-links ${menuActive ? "active" : ""}`}>
        <li><Link to="/home">Home</Link></li>
        <li className="dropdown">
          <span>More Details</span>
          <ul className="dropdown-menu">
            <li><Link to="/employee-list">Emp Details</Link></li>
            <li><Link to="/add-employee">Add New Emp</Link></li>
          </ul>
        </li>
        <li className="dropdown">
          <span>Master Details</span>
          <ul className="dropdown-menu">
            <li><Link to="/state-form">State</Link></li>
            <li><Link to="/district-form">District</Link></li>
            <li><Link to="/city-form">City</Link></li>
            <li><Link to="/tech-form">Technology</Link></li>
            <li><Link to="/designation-form">Designation</Link></li>
            <li><Link to="/salary-form">Salary Page</Link></li>
            <li><Link to="/student-form">Student Page</Link></li>
          </ul>
        </li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
