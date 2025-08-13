import React from "react";
import "./style.css";

function HomeView() {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to Locofy 🚀</h1>
      <p className="home-subtitle">
        Turn your designs into production-ready front-end code — faster than ever!
      </p>
      
      {/* Video in the center */}
      <div className="video-container">
        <video
          src="https://static.locofy.ai/assets/videos/home.mp4"
          controls
          autoPlay
          muted
          loop
          className="home-video"
        />
      </div>

      <button className="home-button" onClick={() => alert("Let’s start building!")}>
        Get Started
      </button>
    </div>
  );
}

export default HomeView;
