import React from "react";
import "./Evidence.css";

export default function Evidence() {
  return (
    <div className="page evidence-page">
      {/* Center note placeholder */}
      <div className="evidence-frame"></div>

      {/* Bottom description box frame */}
      <div className="description-frame"></div>

      {/* Next button placeholder */}
      <div className="next-button">
        <span>Next</span>
        <span className="arrow">›</span>
      </div>
    </div>
  );
}
