// src/Phone/Chat.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Phone.css";   // ถ้าไฟล์อยู่ในโฟลเดอร์เดียวกับ Phone.css

export default function Chat() {
  const navigate = useNavigate();

  const goBack = () => {
    // กลับไปหน้า MessageApp
    navigate("/messages");
    // หรือจะใช้ navigate(-1) ก็ได้ ถ้าหลัง ๆ มี flow ซับซ้อนขึ้น
  };

  return (
    <div className="lock-page">
      <div className="lock-phone">
        <div className="lock-phone-screen chat-screen">
          
          {/* Top grey header */}
          <div className="chat-header">
            <div className="chat-back-arrow" onClick={goBack}>‹</div>
            <img
              src="/pics/user.png"
              alt="user icon"
              className="chat-user-icon"
            />
          </div>

          {/* ตรงกลางไว้โชว์ข้อความแชทจริงในอนาคต */}
          {/* ตอนนี้ใส่ placeholder ง่าย ๆ กันจอโล่ง */}
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

          {/* Bottom grey footer frame */}
          <div className="chat-footer">
            <div className="chat-input-box">Type Something..</div>
          </div>
        </div>
      </div>

      {/* Right-side narration box */}
      <div className="lock-text-box">
        <div className="story-text">
          <p>
            You are now inside the victim’s group chat.
          </p>
          <p>
            Later, this panel can explain clues, choices, or summarize what you’ve noticed.
          </p>
        </div>
      </div>
    </div>
  );
}