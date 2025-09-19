import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar2.css";

const Navbar2 = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="navbar">
      <div className="logo">Rerunsoft</div>
      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>

        <li className="dropdown" onClick={toggleDropdown}>
          <span>More Details</span>
          {dropdownOpen && (
            <ul className="dropdown-menu">
              <li>
                <Link to="/employee-list">Employee Details</Link>
              </li>
              <li>
                <Link to="/add-employee">Add New Employee</Link>
              </li>
            </ul>
          )}
        </li>

        <li className="dropdown" onClick={toggleDropdown}>
          <span>Master Details</span>
          {dropdownOpen && (
            <ul className="dropdown-menu">
              <li>
                <Link to="/state-form">State</Link>
              </li>
              <li>
                <Link to="/district-form">District</Link>
              </li>
              <li>
                <Link to="/city-form">City</Link>
              </li>
            </ul>
          )}
        </li>

        <li>
          <Link to="/services">Services</Link>
        </li>

        <li>
          <Link to="/contact">Contact</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar2;
