import React from "react";
import "./Character.css";

export default function Character() {
  return (
    <div className="character-page">
      <h1 className="title">Suspects</h1>

      <div className="suspect-grid">
        {/* Row 1 */}
        <div className="suspect-card">
          <div className="suspect-img"></div>
          <div className="suspect-info">
            <p>Name</p>
            <p>Role:</p>
            <p>Trust:</p>
            <p>Relation:</p>
            <p>Suspicion:</p>
            <p>Trait:</p>
          </div>
        </div>

        <div className="suspect-card">
          <div className="suspect-img"></div>
          <div className="suspect-info">
            <p>Name</p>
            <p>Role:</p>
            <p>Trust:</p>
            <p>Relation:</p>
            <p>Suspicion:</p>
            <p>Trait:</p>
          </div>
        </div>

        {/* Row 2 */}
        <div className="suspect-card">
          <div className="suspect-img"></div>
          <div className="suspect-info">
            <p>Name</p>
            <p>Role:</p>
            <p>Trust:</p>
            <p>Relation:</p>
            <p>Suspicion:</p>
            <p>Trait:</p>
          </div>
        </div>

        <div className="suspect-card">
          <div className="suspect-img"></div>
          <div className="suspect-info">
            <p>Name</p>
            <p>Role:</p>
            <p>Trust:</p>
            <p>Relation:</p>
            <p>Suspicion:</p>
            <p>Trait:</p>
          </div>
        </div>

        {/* Row 3 */}
        <div className="suspect-card">
          <div className="suspect-img"></div>
          <div className="suspect-info">
            <p>Name</p>
            <p>Role:</p>
            <p>Trust:</p>
            <p>Relation:</p>
            <p>Suspicion:</p>
            <p>Trait:</p>
          </div>
        </div>
      </div>

      <div className="next-button">
        <span>Next</span>
        <span className="arrow">›</span>
      </div>
    </div>
  );
}
