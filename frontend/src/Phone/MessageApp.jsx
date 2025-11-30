// src/Phone/MessageApp.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Phone/Phone.css";

export default function MessageApp() {
  const navigate = useNavigate();
  const [chatTitle, setChatTitle] = useState("Group Chat");

  useEffect(() => {
    // ดึง story จาก localStorage มาใช้ตั้งชื่อห้อง
    const saved = localStorage.getItem("currentStory");
    if (saved) {
      try {
        const story = JSON.parse(saved);
        if (story.title) {
          setChatTitle(story.title);
        }
      } catch (e) {
        console.error("Error parsing story for MessageApp:", e);
      }
    }
  }, []);

  const openChat = () => {
    navigate("/chat");
  };

  return (
    <div className="lock-page">
      {/* LEFT: phone frame */}
      <div className="lock-phone">
        <div
          className="lock-phone-screen"
          style={{ backgroundColor: "#000" }} // พื้นหลังดำ ตอนนี้ simple ไปก่อน
        >
          {/* ด้านบน header เขียนว่า Messages */}
          <div className="chat-header">
            <div className="messages">Messages</div>
          </div>

          {/* list แชท (ตอนนี้มีห้องเดียว) */}
          <div
            style={{
              marginTop: "100px",
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

      {/* RIGHT: text box frame (ไว้บรรยายเพิ่มเติมทีหลัง) */}
      <div className="lock-text-box">
        <div className="story-text">
          <p>You're now inside the victim's phone.</p>
          <p>
            Start by opening the main group chat. Someone in there knows more
            than they’re saying.
          </p>
        </div>
      </div>
    </div>
  );
}