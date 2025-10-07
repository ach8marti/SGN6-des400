import React from "react";
import "./Investigate.css";

export default function Investigate() {
  return (
    <div className="investigate-page">
      {/* Character Info Frame */}
      <div className="info-frame">
        <div className="profile-frame"></div>
        <div className="text-info">
          <h2>Character Name</h2>
          <p>Role / Relation Info</p>
          <p>Trust ★★★☆☆</p>
        </div>
      </div>

      {/* Image / Character Frame */}
      <div className="image-frame"></div>

      {/* Dialogue Box */}
      <div className="dialogue-box">
        <p>
          I—I was home, I swear. I didn’t go anywhere... I just stayed inside.
        </p>
      </div>

      {/* Choice Buttons */}
      <div className="choices">
        <button>What were you hiding from them?</button>
        <button>If you’re innocent, why are you so nervous?</button>
        <button>Where exactly were you last night?</button>
      </div>
    </div>
  );
}
