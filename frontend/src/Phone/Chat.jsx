// src/Phone/Chat.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Phone.css";
import TopIcons from "./TopIcons";
import {
  loadGame,
  saveGame,
  getCorrectAnswers,
  getInterrogationCount,
  increaseCorrect,
  addEvidenceUnlock,
} from "../gameState";

export default function Chat() {
  const navigate = useNavigate();

  const [chatTitle, setChatTitle] = useState("Group Chat");
  const [storyId, setStoryId] = useState(null);

  const [phase, setPhase] = useState(1);
  const [nextPhase, setNextPhase] = useState(null);

  const [messages, setMessages] = useState([]);
  const [replies, setReplies] = useState([]);
  const [selectedReply, setSelectedReply] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [interrogationCount, setInterrogationCount] = useState(0);

  useEffect(() => {
    const gs = loadGame();
    setCorrectAnswers(getCorrectAnswers());
    setInterrogationCount(getInterrogationCount());

    const saved = localStorage.getItem("currentStory");
    if (saved) {
      try {
        const story = JSON.parse(saved);
        if (story.title) setChatTitle(story.title);
        setStoryId(story.id || "uni_group");
      } catch {
        setStoryId("uni_group");
      }
    } else {
      setStoryId("uni_group");
    }
  }, []);

  useEffect(() => {
    if (!storyId) return;

    const fetchChat = async () => {
      setLoading(true);
      setErrorText("");

      try {
        const params = new URLSearchParams({ storyId, phase });
        const url = `http://localhost:3001/api/chat?${params}`;
        const res = await fetch(url);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "chat error");

        const incoming = (data.messages || []).map((m) => ({
          ...m,
          fromPlayer: false,
        }));

        setMessages((prev) => [...prev, ...incoming]);
        setReplies(data.choices || []);
        setNextPhase(
          typeof data.nextPhase === "number" ? data.nextPhase : null
        );
      } catch (err) {
        setErrorText("Failed to load chat script.");
      } finally {
        setLoading(false);
      }
    };

    fetchChat();
  }, [storyId, phase]);

  // อัปเดต interrogationCount จาก localStorage ทุกครั้งที่ messages เปลี่ยน
  useEffect(() => {
    setInterrogationCount(getInterrogationCount());
  }, [messages]);

  const goBack = () => navigate("/messages");

  const handleReplyClick = (reply) => {
    setSelectedReply(reply.id);

    setMessages((prev) => [
      ...prev,
      {
        speaker: "You",
        text: reply.text,
        time: "Now",
        fromPlayer: true,
      },
    ]);

    if (reply.isCorrect) {
      increaseCorrect();
      setCorrectAnswers(getCorrectAnswers());

      const unlockIds = Array.isArray(reply.unlocksEvidence)
        ? reply.unlocksEvidence
        : [];
      if (unlockIds.length > 0) {
        addEvidenceUnlock(unlockIds);
      }
    }

    const gs = loadGame();
    saveGame(gs);

    if (reply.isCorrect && nextPhase) {
      setTimeout(() => {
        setSelectedReply(null);
        setPhase(nextPhase);
      }, 600);
    }
  };

  // ตอนนี้ปรับให้ต้อง "ตอบถูก 2 ครั้ง" + "สอบสวน 2 ครั้ง"
  const canAccuse = correctAnswers >= 2 && interrogationCount >= 2;

  return (
    <div className="lock-page">
      <TopIcons />

      <div className="lock-phone">
        <div className="lock-phone-screen chat-screen">
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
              <img src="/pics/user.png" className="chat-user-icon" alt="user" />
              <div style={{ fontSize: "14px", color: "#fff" }}>{chatTitle}</div>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              padding: "16px 20px",
              overflowY: "auto",
              marginTop: "80px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              color: "#fff",
            }}
          >
            {loading && <p>Loading chat...</p>}
            {errorText && <p>{errorText}</p>}

            {!loading &&
              messages.map((msg, index) => {
                const isPlayer = msg.fromPlayer;
                return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: isPlayer ? "flex-end" : "flex-start",
                    }}
                  >
                    {!isPlayer && (
                      <div style={{ fontSize: "12px", opacity: 0.7 }}>
                        {msg.speaker}
                      </div>
                    )}

                    <div
                      style={{
                        background: isPlayer ? "#C12020" : "#4a4a4a",
                        borderRadius: "16px",
                        padding: "10px 14px",
                        maxWidth: "75%",
                      }}
                    >
                      {msg.text}
                    </div>

                    <div style={{ fontSize: "10px", opacity: 0.5 }}>
                      {msg.time}
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="chat-footer">
            <div className="chat-input-box">Type Something..</div>
          </div>
        </div>
      </div>

      <div className="lock-text-box">
        <div className="story-text" style={{ padding: "30px" }}>
          <p style={{ fontSize: "18px", color: "#e8e8e8" }}>
            Oh no. I must respond before they realize the victim is already
            gone…
          </p>

          <p
            style={{
              fontSize: "16px",
              color: "#ff6b6b",
              fontWeight: "bold",
            }}
          >
            What should I reply?
          </p>

          {replies.map((reply) => (
            <button
              key={reply.id}
              onClick={() => handleReplyClick(reply)}
              style={{
                background:
                  selectedReply === reply.id ? "#8b3a3a" : "#6b6b6b",
                color: "#fff",
                borderRadius: "12px",
                padding: "14px 20px",
                marginBottom: "12px",
                textAlign: "left",
                fontFamily: "'Special Elite'",
              }}
            >
              {reply.text}
            </button>
          ))}

          {canAccuse && (
  <button
    onClick={() => navigate("/killer")}
    style={{
      marginTop: "25px",
      padding: "16px 28px",
      fontSize: "20px",
      fontFamily: "'Special Elite'",
      borderRadius: "14px",
      border: "2px solid #ffaaaa",
      background: "linear-gradient(90deg, #b30000, #ff1a1a)",
      color: "#fff",
      cursor: "pointer",
      boxShadow: "0 0 14px rgba(255,0,0,0.9), 0 0 25px rgba(255,50,50,0.6)",
      textShadow: "0 0 3px #000",
      transition: "0.2s",
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.boxShadow =
        "0 0 22px rgba(255,0,0,1), 0 0 35px rgba(255,80,80,0.8)";
      e.currentTarget.style.transform = "scale(1.05)";
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.boxShadow =
        "0 0 14px rgba(255,0,0,0.9), 0 0 25px rgba(255,50,50,0.6)";
      e.currentTarget.style.transform = "scale(1)";
    }}
  >
    🔥 ACCUSE THE KILLER 🔥
  </button>
)}
        </div>
      </div>
    </div>
  );
}