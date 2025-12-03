// src/Phone/Lock.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Phone.css";
import { resetGame } from "../gameState";

export default function Lock() {
  const navigate = useNavigate();

  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      resetGame();  // ล้าง state เกม + currentStory ทุกครั้งที่เข้าหน้า Lock

      setLoading(true);
      setStory(null);

      try {
        const res = await fetch("http://localhost:3001/api/story");

        if (!res.ok) {
          console.error("Failed to fetch story. Status:", res.status);
          setStory(null);
          return;
        }

        const data = await res.json();

        if (data && data.error) {
          console.error("Backend /api/story error:", data.error);
          setStory(null);
          return;
        }

        localStorage.setItem("currentStory", JSON.stringify(data));
        setStory(data);
      } catch (err) {
        console.error("Error fetching story:", err);
        setStory(null);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const next = () => {
    navigate("/unlock");
  };

  if (loading) {
    return (
      <div className="lock-page">
        <div className="lock-phone">
          <div
            className="lock-phone-screen"
            style={{ backgroundImage: "url('/pics/Wallpaper.jpg')" }}
          >
            <div className="lock-time">08:35</div>
          </div>
        </div>
        <div className="lock-text-box">
          <div className="story-text">
            <p>Loading case file...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="lock-page">
        <div className="lock-phone">
          <div
            className="lock-phone-screen"
            style={{ backgroundImage: "url('/pics/Wallpaper.jpg')" }}
          >
            <div className="lock-time">08:35</div>
          </div>
        </div>
        <div className="lock-text-box">
          <div className="story-text">
            <p>Failed to load story.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lock-page">
      <div className="lock-phone">
        <div
          className="lock-phone-screen"
          style={{ backgroundImage: "url('/pics/Wallpaper.jpg')" }}
        >
          <div className="lock-time">08:35</div>
        </div>
      </div>

      <div className="lock-text-box">
        <div className="story-text">
          <p style={{ opacity: 0.8, fontSize: "14px", marginBottom: "8px" }}>
            Case: {story.title}
          </p>

          {Array.isArray(story.openingParagraphs) &&
            story.openingParagraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
        </div>
      </div>

      <div className="next-button" onClick={next}>
        <span>Next</span>
        <span className="arrow">›</span>
      </div>
    </div>
  );
}