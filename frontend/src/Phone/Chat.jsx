// src/Phone/Chat.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Phone.css";
import TopIcons from "./TopIcons";

export default function Chat() {
  const navigate = useNavigate();

  const [chatTitle, setChatTitle] = useState("Group Chat");
  const [storyId, setStoryId] = useState(null);

  const [phase, setPhase] = useState(1);
  const [messages, setMessages] = useState([]);
  const [replies, setReplies] = useState([]);
  const [selectedReply, setSelectedReply] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  // Load story from localStorage → storyId + title
  useEffect(() => {
    const saved = localStorage.getItem("currentStory");
    if (saved) {
      try {
        const story = JSON.parse(saved);
        if (story.title) {
          setChatTitle(story.title);
        }
        if (story.id) {
          setStoryId(story.id); // "uni_group" | "office_group" | "village_line"
        } else {
          setStoryId("uni_group");
        }
      } catch (e) {
        console.error("Error parsing story for Chat:", e);
        setStoryId("uni_group");
      }
    } else {
      setStoryId("uni_group");
    }
  }, []);

  // Fetch chat script from backend when storyId/phase changes
  useEffect(() => {
    if (!storyId) return;

    const fetchChat = async () => {
      setLoading(true);
      setErrorText("");

      try {
        const params = new URLSearchParams({
          storyId,
          phase: String(phase),
        });

        const res = await fetch(
          `http://localhost:3001/api/chat?${params.toString()}`
        );
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `HTTP ${res.status}`);
        }

        const data = await res.json();
        setMessages(data.messages || []);
        setReplies(data.choices || []);
      } catch (err) {
        console.error("Error fetching chat script:", err);
        setErrorText("Failed to load chat script.");
      } finally {
        setLoading(false);
      }
    };

    fetchChat();
  }, [storyId, phase]);

  const goBack = () => {
    navigate("/messages");
  };

  const handleReplyClick = (reply) => {
    setSelectedReply(reply.id);

    // later: update game state, unlock evidence, go to next phase, etc.
    console.log("Player selected reply:", {
      storyId,
      phase,
      replyId: reply.id,
    });
  };

  return (
    <div className="lock-page">
      {/* top-right suspects / evidence icons */}
      <TopIcons />

      {/* LEFT: phone chat UI */}
      <div className="lock-phone">
        <div className="lock-phone-screen chat-screen">
          {/* HEADER */}
          <div className="chat-header">
            <div className="chat-back-arrow" onClick={goBack}>
              ‹
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                src="/pics/user.png"
                alt="user icon"
                className="chat-user-icon"
                style={{ position: "relative", marginBottom: "4px" }}
              />
              <div
                style={{
                  fontSize: "14px",
                  color: "#fff",
                  opacity: 0.9,
                }}
              >
                {chatTitle}
              </div>
            </div>
          </div>

          {/* CHAT BODY */}
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
              marginTop: "80px", // leave space for header
            }}
          >
            {loading && <p>Loading chat...</p>}
            {errorText && !loading && <p>{errorText}</p>}

            {!loading &&
              !errorText &&
              messages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  {/* sender name */}
                  <div
                    style={{
                      fontSize: "12px",
                      color: "rgba(255,255,255,0.7)",
                      paddingLeft: "4px",
                    }}
                  >
                    {msg.name}
                  </div>
                  {/* bubble */}
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
                  {/* time */}
                  <div
                    style={{
                      fontSize: "10px",
                      color: "rgba(255,255,255,0.5)",
                      paddingLeft: "4px",
                    }}
                  >
                    {msg.time}
                  </div>
                </div>
              ))}
          </div>

          {/* FOOTER (fake input bar) */}
          <div className="chat-footer">
            <div className="chat-input-box">Type Something..</div>
          </div>
        </div>
      </div>

      {/* RIGHT: narration + choices */}
      <div className="lock-text-box">
        <div
          className="story-text"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            padding: "30px",
          }}
        >
          <p
            style={{
              fontSize: "18px",
              lineHeight: "1.6",
              color: "#e8e8e8",
              marginBottom: "10px",
            }}
          >
            Oh no. I must respond before they realize the victim is already
            gone. The killer is still out there, hidden among them. It could be
            any one of them. I can't let them suspect too quickly.
          </p>

          <p
            style={{
              fontSize: "16px",
              color: "#ff6b6b",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            What should I reply?
          </p>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {replies.map((reply) => (
              <button
                key={reply.id}
                onClick={() => handleReplyClick(reply)}
                style={{
                  background:
                    selectedReply === reply.id ? "#8b3a3a" : "#6b6b6b",
                  color: "#fff",
                  padding: "14px 20px",
                  borderRadius: "12px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "15px",
                  fontFamily: "'Special Elite', cursive",
                  textAlign: "left",
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                }}
              >
                {reply.text}
              </button>
            ))}

            {!loading && !errorText && replies.length === 0 && (
              <p style={{ fontSize: "14px", color: "#ccc" }}>
                No choices defined for this phase yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}