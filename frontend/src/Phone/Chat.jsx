import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Phone.css";
import TopIcons from "./TopIcons";
import { loadGame, saveGame } from "../gameState";

export default function Chat() {
  const navigate = useNavigate();

  const [chatTitle, setChatTitle] = useState("Group Chat");
  const [storyId, setStoryId] = useState(null);

  const [nextPhase, setNextPhase] = useState(null);
  const [phase, setPhase] = useState(1);
  const [messages, setMessages] = useState([]);
  const [replies, setReplies] = useState([]);
  const [selectedReply, setSelectedReply] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [interrogationCount, setInterrogationCount] = useState(0);

  useEffect(() => {
  const gs = loadGame();
  setInterrogationCount(gs.interrogationCount || 0);
}, [messages]);

  useEffect(() => {
    const saved = localStorage.getItem("currentStory");
    const gs = loadGame();

    setCorrectAnswers(gs.correctAnswers || 0);
    setInterrogationCount(gs.interrogationCount || 0);

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

        if (!res.ok) throw new Error(data.error);

        const incoming = (data.messages || []).map((m) => ({
          ...m,
          fromPlayer: false,
        }));

        setMessages((prev) => [...prev, ...incoming]);
        setReplies(data.choices || []);
        setNextPhase(typeof data.nextPhase === "number" ? data.nextPhase : null);

      } catch (err) {
        setErrorText("Failed to load chat script.");
      } finally {
        setLoading(false);
      }
    };

    fetchChat();
  }, [storyId, phase]);

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

    const gs = loadGame();

    if (reply.isCorrect) {
      gs.correctAnswers = (gs.correctAnswers || 0) + 1;
      setCorrectAnswers(gs.correctAnswers);
    }

    saveGame(gs);

    if (reply.isCorrect && nextPhase) {
      setTimeout(() => {
        setSelectedReply(null);
        setPhase(nextPhase);

        const latest = loadGame();
        setInterrogationCount(latest.interrogationCount || 0);
      }, 600);
    }
  };

  const canAccuse = correctAnswers >= 4 && interrogationCount >= 2;

  return (
    <div className="lock-page">
      <TopIcons />

      <div className="lock-phone">
        <div className="lock-phone-screen chat-screen">

          <div className="chat-header">
            <div className="chat-back-arrow" onClick={goBack}>‹</div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
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
            {messages.map((msg, index) => {
              const isPlayer = msg.fromPlayer;
              return (
                <div key={index} style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: isPlayer ? "flex-end" : "flex-start",
                }}>
                  {!isPlayer && (
                    <div style={{ fontSize: "12px", opacity: 0.7 }}>{msg.speaker}</div>
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

                  <div style={{ fontSize: "10px", opacity: 0.5 }}>{msg.time}</div>
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
            Oh no. I must respond before they realize the victim is already gone…
          </p>

          <p style={{ fontSize: "16px", color: "#ff6b6b", fontWeight: "bold" }}>
            What should I reply?
          </p>

          {replies.map((reply) => (
            <button
              key={reply.id}
              onClick={() => handleReplyClick(reply)}
              style={{
                background: selectedReply === reply.id ? "#8b3a3a" : "#6b6b6b",
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
              className="accuse-button"
              style={{ marginTop: "20px" }}
              onClick={() => navigate("/killer")}
            >
              Accuse the Killer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}