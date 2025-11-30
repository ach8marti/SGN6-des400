import React from "react";
import { useNavigate } from "react-router-dom";
import "./IndexPage.css";

export default function IndexPage() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/lock");
  };

  return (
    <div className="index-page">
      <button className="start-button" onClick={handleStart}>
        START
      </button>
    </div>
  );
}