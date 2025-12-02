// src/Phone/Lock.jsx
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

        // Basic HTTP error handling
        if (!res.ok) {
          console.error("Failed to fetch story. Status:", res.status);
          setStory(null);
          return;
        }

        const data = await res.json();

        // If backend returns an error object, handle it
        if (data && data.error) {
          console.error("Backend /api/story error:", data.error);
          setStory(null);
          return;
        }

        // Persist selected story (including selectedPasscode fields)
        localStorage.setItem("currentStory", JSON.stringify(data));
        setStory(data);
      } catch (err) {
        console.error("Error fetching story:", err);
        setStory(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, []);

  const next = () => {
    // Proceed to passcode unlock screen
    navigate("/unlock");
  };

  // Loading state while /api/story is in progress
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

  // Error state: could not load or parse a valid story
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

  // Normal state: show the selected story's intro text
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

      {/* RIGHT: story text box */}
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