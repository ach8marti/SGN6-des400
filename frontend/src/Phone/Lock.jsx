import React from "react";
import "../Phone/Phone.css";

export default function Lock() {
  return (
    <div className="lock-page">
      {/* LEFT: phone frame */}
      <div className="lock-phone">
        <div
          className="lock-phone-screen"
          style={{ backgroundImage: "url('/pics/Wallpaper.jpg')" }}
        >
          <div className="lock-time">08:35</div>
        </div>
      </div>

      {/* RIGHT: text box frame (empty) */}
      <div className="lock-text-box"></div>

      {/* NEXT button */}
      <div className="next-button">
        <span>Next</span>
        <span className="arrow">›</span>
      </div>
    </div>
  );
}
