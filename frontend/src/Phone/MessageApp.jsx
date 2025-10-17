import React from "react";
import "../Phone/Phone.css";

export default function MessageApp() {
  return (
    <div className="lock-page">
      {/* LEFT: phone frame */}
      <div className="lock-phone">
        <div
          className="lock-phone-screen"
        >
        <div className="messages">Messages</div>
        </div>
      </div>

      {/* RIGHT: text box frame (empty) */}
      <div className="lock-text-box"></div>

    </div>
  );
}
