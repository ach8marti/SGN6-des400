import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Phone.css";

export default function Lock() {
  const navigate = useNavigate();

  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/story");
        const data = await res.json();

        // เซฟไว้ให้หน้าอื่นใช้ (unlock, suspects ฯลฯ)
        localStorage.setItem("currentStory", JSON.stringify(data));
        setStory(data);
      } catch (err) {
        console.error("Error fetching story:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
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
      {/* LEFT: phone frame */}
      <div className="lock-phone">
        <div
          className="lock-phone-screen"
          style={{ backgroundImage: "url('/pics/Wallpaper.jpg')" }}
        >
          <div className="lock-time">08:35</div>
        </div>
      </div>

      {/* RIGHT: story text box (เฉพาะเนื้อเรื่อง) */}
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

      {/* NEXT button */}
      <div className="next-button" onClick={next}>
        <span>Next</span>
        <span className="arrow">›</span>
      </div>
    </div>
  );
}