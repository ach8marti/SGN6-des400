import React from "react";
import { useNavigate } from "react-router-dom";
import { resetGame } from "../gameState";
import "./IndexPage.css";

export default function IndexPage() {
  const navigate = useNavigate();

  const handleStart = () => {
    resetGame();
    navigate("/lock");
  };

  return (
    <div className="index-page">
      <button onClick={handleStart} className="start-button">
        Start
      </button>
    </div>
  );
}