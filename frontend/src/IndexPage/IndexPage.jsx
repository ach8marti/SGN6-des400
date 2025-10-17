import React from "react";
import "./IndexPage.css";

export default function IndexPage() {
  const start = () => {
    alert("Game Starting...");
  };

  const quit = () => {
    alert("Quit Game");
  };

  return (
    <div className="menu-page">
      <div className="menu">
        <span id="start" onClick={start}>START</span>
        <span id="quit" onClick={quit}>Quit</span>
      </div>
    </div>
  );
}
