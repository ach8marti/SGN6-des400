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
        <img
          src="/icons/suspects.png"
          alt="suspects"
          className="icon-img"
        />
      </button>

      <button
        className={`icon-button ${!evidenceUnlocked ? "locked" : ""}`}
        onClick={goEvidence}
      >
        <img
          src="/icons/evidence.png"
          alt="evidence"
          className="icon-img"
        />
        {!evidenceUnlocked && <span className="icon-lock-overlay">🔒</span>}
      </button>
    </div>
  );
}