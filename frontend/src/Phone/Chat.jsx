import React from "react";
import "../Phone/Phone.css";

export default function Chat() {
  return (
    <div className="lock-page">
      <div className="lock-phone">
        <div className="lock-phone-screen chat-screen">
          
          {/* Top grey header */}
          <div className="chat-header">
            <div className="chat-back-arrow">‹</div>
            <img src="/pics/user.png" alt="user icon" className="chat-user-icon" />
          </div>

          {/* Bottom grey footer frame */}
          <div className="chat-footer">
            <div className="chat-input-box">Type Something..</div>
          </div>
        </div>
      </div>

      {/* Right-side narration box */}
      <div className="lock-text-box"></div>
    </div>
  );
}
