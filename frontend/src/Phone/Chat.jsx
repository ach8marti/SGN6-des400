import React from "react";
import { useNavigate } from "react-router-dom";
import "./Phone.css";
import TopIcons from "./TopIcons";

export default function Chat() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate("/messages");
  };

  return (
    <div className="lock-page">
      <TopIcons />

      <div className="lock-phone">
        <div className="lock-phone-screen chat-screen">
          <div className="chat-header">
            <div className="chat-back-arrow" onClick={goBack}>
              ‹
            </div>
            <img
              src="/pics/user.png"
              alt="user icon"
              className="chat-user-icon"
            />
          </div>

          <div
            style={{
              flex: 1,
              marginTop: "80px",
              padding: "16px 20px",
              overflowY: "auto",
              color: "#fff",
              fontSize: "14px",
            }}
          >
            <p>(Chat messages will appear here.)</p>
          </div>

          <div className="chat-footer">
            <div className="chat-input-box">Type Something..</div>
          </div>
        </div>
      </div>

      <div className="lock-text-box">
        <div className="story-text">
          <p>You are now inside the victim’s group chat.</p>
          <p>
            Later, this panel can explain clues, choices, or summarize what
            you’ve noticed.
          </p>
        </div>
      </div>
    </div>
  );
}