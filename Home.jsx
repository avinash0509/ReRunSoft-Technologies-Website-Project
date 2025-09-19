import React from "react";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to the Home Page</h1>
      <p>This is the main landing page of the website.</p>
      <img
        src="logo.png"
        alt="Home Page Banner"
      />
    </div>
  );
};

export default Home;
