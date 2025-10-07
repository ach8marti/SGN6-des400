import React from "react";
import "./Killer.css";

export default function Killer() {
  return (
    <div className="killer-page">
      {/* Header */}
      <div className="header-banner">
        <h1>Choose the killer and give a reason</h1>
      </div>

      {/* Suspect frames */}
      <div className="suspect-row">
        <div className="suspect-box">
          <div className="suspect-img"></div>
          <p>Name</p>
        </div>
        <div className="suspect-box">
          <div className="suspect-img"></div>
          <p>Name</p>
        </div>
        <div className="suspect-box">
          <div className="suspect-img"></div>
          <p>Name</p>
        </div>
        <div className="suspect-box">
          <div className="suspect-img"></div>
          <p>Name</p>
        </div>
        <div className="suspect-box">
          <div className="suspect-img"></div>
          <p>Name</p>
        </div>
      </div>

      {/* Reason input placeholder */}
      <div className="reason-box">
        <p>Give us your reason...</p>
      </div>
    </div>
  );
}
