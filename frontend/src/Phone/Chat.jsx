import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Phone.css";
import TopIcons from "./TopIcons";

export default function Chat() {
  const navigate = useNavigate();
  const [chatTitle, setChatTitle] = useState("Group Chat");
  const [selectedReply, setSelectedReply] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("currentStory");
    if (saved) {
      try {
        const story = JSON.parse(saved);
        if (story.title) {
          setChatTitle(story.title);
        }
      } catch (e) {
        console.error("Error parsing story for Chat:", e);
      }
    }
  }, []);

  const goBack = () => {
    navigate("/messages");
  };

  // Example messages
  const messages = [
    { name: "Mina", text: "Gosh. Just let it go.", time: "04:38" },
    { name: "Liam", text: "What's going on?", time: "04:39" },
    { name: "Sophia", text: "Where did Jane go? Is she really learn how to shut up?", time: "04:40" },
    { name: "Ethan", text: "lol just go to bed.", time: "04:41" },
    { name: "Mina", text: "gn guys", time: "04:41" },
    { name: "John", text: "Jane, where are you? We have a presentation today, remember? You can’t miss this one like others.", time: "09:00" },
  ];

  const replies = [
    { id: 1, text: "Sorry, I feel sick." },
    { id: 2, text: "I'll be there soon." },
    { id: 3, text: "Don't worry about me." },
  ];

  return (
    <div className="lock-page">
      <TopIcons />
      <div className="lock-phone">
        <div className="lock-phone-screen chat-screen">
          {/* HEADER */}
          <div className="chat-header">
            <div className="chat-back-arrow" onClick={goBack}>
              ‹
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <img
                src="/pics/user.png"
                alt="user icon"
                className="chat-user-icon"
                style={{ position: "relative", marginBottom: "4px" }}
              />
              <div style={{ fontSize: "14px", color: "#fff", opacity: 0.9 }}>
                {chatTitle}
              </div>
            </div>
          </div>

          {/* CHAT MESSAGES */}
          <div
            style={{
              flex: 1,
              padding: "16px 20px",
              overflowY: "auto",
              color: "#fff",
              fontSize: "14px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {messages.map((msg, index) => (
              <div key={index} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {/* Name */}
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", paddingLeft: "4px" }}>
                  {msg.name}
                </div>
                {/* Message bubble */}
                <div
                  style={{
                    background: "#4a4a4a",
                    borderRadius: "16px",
                    padding: "10px 14px",
                    maxWidth: "75%",
                    alignSelf: "flex-start",
                    wordWrap: "break-word",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                  }}
                >
                  {msg.text}
                </div>
                {/* Time */}
                <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", paddingLeft: "4px" }}>
                  {msg.time}
                </div>
              </div>
            ))}
          </div>

          {/* FOOTER */}
          <div className="chat-footer">
            <div className="chat-input-box">Type Something..</div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE STORY BOX */}
      <div className="lock-text-box">
        <div className="story-text" style={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: "20px",
          padding: "30px"
        }}>
          <p style={{ 
            fontSize: "18px", 
            lineHeight: "1.6",
            color: "#e8e8e8",
            marginBottom: "10px"
          }}>
            Oh no. I must respond before they realize Jane is already dead. The killer is still out there, hidden among them. It could be any one of them. I can't let them suspect too quickly.
          </p>
          
          <p style={{ 
            fontSize: "16px", 
            color: "#ff6b6b",
            fontWeight: "bold",
            marginBottom: "10px"
          }}>
            What should I reply?
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {replies.map((reply) => (
              <button
                key={reply.id}
                onClick={() => setSelectedReply(reply.id)}
                style={{
                  background: selectedReply === reply.id ? "#8b3a3a" : "#6b6b6b",
                  color: "#fff",
                  padding: "14px 20px",
                  borderRadius: "12px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "15px",
                  fontFamily: "'Special Elite', cursive",
                  textAlign: "left",
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
                }}
              >
                {reply.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}