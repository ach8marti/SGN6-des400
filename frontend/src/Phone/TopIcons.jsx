import React from "react";
import { useNavigate } from "react-router-dom";
import "./Phone.css";

export default function TopIcons() {
  const navigate = useNavigate();

  const goSuspects = () => {
    navigate("/suspects");
  };

  const goEvidence = () => {
    navigate("/evidence");
  };

  const evidenceUnlocked =
    typeof window !== "undefined" &&
    localStorage.getItem("evidenceUnlocked") === "true";

  return (
    <div className="top-icons">
      <button className="icon-button" onClick={goSuspects}>
        <i className="fa-solid fa-magnifying-glass"></i>
      </button>

      <button
        className={`icon-button ${!evidenceUnlocked ? "locked" : ""}`}
        onClick={goEvidence}
      >
        <i className="fa-solid fa-folder"></i>
        {!evidenceUnlocked && <span className="icon-lock-overlay">🔒</span>}
      </button>
    </div>
  );
}