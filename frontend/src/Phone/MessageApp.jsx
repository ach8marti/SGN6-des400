// src/Phone/MessageApp.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Phone.css";
import TopIcons from "./TopIcons";

export default function MessageApp() {
  const navigate = useNavigate();
  const [chatTitle, setChatTitle] = useState("Group Chat");

  useEffect(() => {
    // Load the currently selected story from localStorage.
    // This is populated earlier on the Lock screen after calling /api/story.
    const saved = localStorage.getItem("currentStory");
    if (saved) {
      try {
        const story = JSON.parse(saved);
        // Use the story title as the group chat name if available.
        if (story && story.title) {
          setChatTitle(story.title);
        }
      } catch (e) {
        console.error("Error parsing story for MessageApp:", e);
      }
    }
  }, []);

  // Navigate into the main group chat view.
  const openChat = () => {
    navigate("/chat");
  };

  return (
    <div className="lock-page">
      {/* Top-right icons: suspects / evidence shortcuts */}
      <TopIcons />

      {/* LEFT: phone frame with messages list */}
      <div className="lock-phone">
        <div className="chat-screen">
          {/* Top header bar inside the phone */}
          <div className="chat-header">
            <div className="messages">Messages</div>
          </div>

          {/* Message list (currently a single group chat entry) */}
          <div
            style={{
              marginTop: "30px",
              width: "100%",
              padding: "0 24px",
            }}
          >
            <div
              onClick={openChat}
              style={{
                background: "#2f2d33",
                borderRadius: "18px",
                padding: "16px 20px",
                marginBottom: "12px",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0,0,0,0.6)",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#3a383f";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#2f2d33";
              }}
            >
              <div
                style={{
                  fontSize: "18px",
                  marginBottom: "4px",
                  color: "#fff",
                }}
              >
                {chatTitle}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                Group chat · last active recently
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: narration / instruction panel */}
      <div className="lock-text-box">
        <div className="story-text">
          <p>You're now inside the victim's phone.</p>
          <p>
            Start by opening the main group chat. Someone in there knows more
            than they're saying.
          </p>
        </div>
      </div>
    </div>
  );
}