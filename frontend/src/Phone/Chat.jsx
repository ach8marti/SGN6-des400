// src/Phone/Chat.jsx
import React, { useEffect, useState, useRef } from "react";
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
  clearChatData,
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
  const [loadedPhases, setLoadedPhases] = useState(new Set());
  const [initialized, setInitialized] = useState(false);
  
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Initial load - check for game reset and load saved chat data
  useEffect(() => {
    const gs = loadGame();
    
    // Check if game was reset (no game state = fresh start)
    const hasGameState = gs && Object.keys(gs).length > 0;
    const hasChatMessages = localStorage.getItem("chatMessages");
    
    // If no game state but chat exists, clear chat
    if (!hasGameState && hasChatMessages) {
      clearChatData();
    }
    
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

    // Load saved chat data only if game state exists
    if (hasGameState) {
      const savedMessages = localStorage.getItem("chatMessages");
      const savedPhase = localStorage.getItem("chatPhase");
      const savedLoadedPhases = localStorage.getItem("chatLoadedPhases");
      const savedReplies = localStorage.getItem("chatReplies");
      const savedNextPhase = localStorage.getItem("chatNextPhase");
      
      if (savedMessages) {
        try {
          setMessages(JSON.parse(savedMessages));
        } catch (e) {
          console.error("Failed to load messages:", e);
        }
      }
      
      if (savedPhase) {
        setPhase(parseInt(savedPhase));
      }
      
      if (savedLoadedPhases) {
        try {
          setLoadedPhases(new Set(JSON.parse(savedLoadedPhases)));
        } catch (e) {
          console.error("Failed to load phases:", e);
        }
      }

      // Only load replies if we haven't met the accuse conditions
      const canAccuseNow = gs.correctAnswers >= 2 && gs.interrogationCount >= 2;
      if (savedReplies && !canAccuseNow) {
        try {
          const loadedReplies = JSON.parse(savedReplies);
          setReplies(loadedReplies);
          // If we have saved replies, skip loading state
          if (loadedReplies.length > 0) {
            setLoading(false);
          }
        } catch (e) {
          console.error("Failed to load replies:", e);
        }
      } else if (canAccuseNow) {
        // Clear replies if conditions are met
        setReplies([]);
        setLoading(false);
      }

      if (savedNextPhase) {
        setNextPhase(parseInt(savedNextPhase));
      }
    }
    
    setInitialized(true);
  }, []);

  // Check and clear replies when conditions are met
  useEffect(() => {
    const canAccuseNow = correctAnswers >= 2 && interrogationCount >= 2;
    if (canAccuseNow && replies.length > 0) {
      setReplies([]);
      localStorage.removeItem("chatReplies");
    }
  }, [correctAnswers, interrogationCount, replies.length]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0 && initialized) {
      localStorage.setItem("chatMessages", JSON.stringify(messages));
    }
  }, [messages, initialized]);

  // Save phase to localStorage whenever it changes
  useEffect(() => {
    if (initialized) {
      localStorage.setItem("chatPhase", phase.toString());
    }
  }, [phase, initialized]);

  // Save loaded phases to localStorage
  useEffect(() => {
    if (initialized) {
      localStorage.setItem("chatLoadedPhases", JSON.stringify([...loadedPhases]));
    }
  }, [loadedPhases, initialized]);

  // Save replies to localStorage whenever they change (but not if accuse is available)
  useEffect(() => {
    const canAccuseNow = correctAnswers >= 2 && interrogationCount >= 2;
    if (replies.length > 0 && initialized && !canAccuseNow) {
      localStorage.setItem("chatReplies", JSON.stringify(replies));
    }
  }, [replies, initialized, correctAnswers, interrogationCount]);

  // Save nextPhase to localStorage
  useEffect(() => {
    if (nextPhase !== null && initialized) {
      localStorage.setItem("chatNextPhase", nextPhase.toString());
    }
  }, [nextPhase, initialized]);

  // Fetch chat messages for current phase
  useEffect(() => {
    if (!storyId || !initialized) return;
    
    // Check if this phase has already been loaded
    if (loadedPhases.has(phase)) {
      setLoading(false);
      return;
    }
    
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
        
        // Only set replies if we haven't met accuse conditions
        const canAccuseNow = correctAnswers >= 2 && interrogationCount >= 2;
        if (!canAccuseNow) {
          setReplies(data.choices || []);
        }
        
        setNextPhase(
          typeof data.nextPhase === "number" ? data.nextPhase : null
        );
        
        // Mark this phase as loaded
        setLoadedPhases((prev) => new Set([...prev, phase]));
      } catch (err) {
        setErrorText("Failed to load chat script.");
      } finally {
        setLoading(false);
      }
    };
    fetchChat();
  }, [storyId, phase, loadedPhases, initialized, correctAnswers, interrogationCount]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    setInterrogationCount(getInterrogationCount());
    
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
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
            ref={messagesContainerRef}
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
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-footer">
            <div className="chat-input-box">Type Something..</div>
          </div>
        </div>
      </div>
      <div className="lock-text-box">
        <div className="story-text" style={{ padding: "30px" }}>
          {canAccuse ? (
            // Show only accuse button when conditions are met
            <>
              <p style={{ fontSize: "18px", color: "#e8e8e8" }}>
                You've gathered enough evidence and questioned the suspects. It's time to make your accusation.
              </p>
              <p
                style={{
                  fontSize: "16px",
                  color: "#ff6b6b",
                  fontWeight: "bold",
                  marginBottom: "20px"
                }}
              >
                Who is the killer?
              </p>
              <button
                onClick={() => navigate("/killer")}
                style={{
                  width: "100%",
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
            </>
          ) : (
            // Show reply choices when accuse is not available
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}