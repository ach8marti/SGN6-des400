import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Phone.css";

export default function Unlock() {
  const navigate = useNavigate();

  const [story, setStory] = useState(null);
  const [input, setInput] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Load story from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("currentStory");
    if (!saved) {
      navigate("/lock");
      return;
    }
    
    const parsedStory = JSON.parse(saved);
    setStory(parsedStory);
    
    // Randomly select one hint/passcode pair when story load
    if (parsedStory && parsedStory.passcode && parsedStory.passcode.length > 0) {
      const randomIdx = Math.floor(Math.random() * parsedStory.passcode.length);
      setSelectedIndex(randomIdx);
    }
  }, [navigate]);

  if (!story || selectedIndex === -1) {
    return null; // Or a loading spinner
  }

  // Get the selected passcode and hint paragraph
  const selectedPasscode = story.passcode[selectedIndex];
  const selectedHintParagraph = story.passcodeHintParagraph[selectedIndex];

  const checkPasscode = (code) => {
    if (code === selectedPasscode) {
      // Correct passcode → go to MessageApp
      navigate("/messages", { state: { story } });
    } else {
      // Wrong → increment attempts
      setAttempts((prev) => {
        const next = prev + 1;
        if (next >= 5) {
          navigate("/bad-end");
        }
        return next;
      });

      setInput("");
      setErrorMsg("Incorrect passcode.");
      setTimeout(() => setErrorMsg(""), 1500);
    }
  };

  const handleDigitClick = (digit) => {
    if (input.length >= 6) return;

    const newInput = input + digit;
    setInput(newInput);

    if (newInput.length === 6) {
      checkPasscode(newInput);
    }
  };

  const handleDelete = () => {
    setInput((prev) => prev.slice(0, -1));
  };

  return (
    <div className="lock-page">
      {/* LEFT: phone lock UI */}
      <div className="lock-phone" aria-label="Phone lock screen">
        <div
          className="lock-phone-screen"
          style={{ backgroundImage: "url('/pics/Wallpaper.jpg')" }}
        >
          <div className="passcode-wrap">
            <div className="passcode-title">Enter Passcode</div>
            <div className="passcode-dots" aria-hidden="true">
              {Array.from({ length: 6 }).map((_, i) => (
                <span
                  key={i}
                  className="dot"
                  style={{
                    background:
                      i < input.length
                        ? "rgba(255,255,255,0.9)"
                        : "rgba(68, 62, 62, 0.25)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Numpad */}
          <div className="numpad" aria-hidden="true">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <div
                key={n}
                className="key"
                onClick={() => handleDigitClick(String(n))}
              >
                {n}
              </div>
            ))}
            <div /> {/* spacer */}
            <div className="key zero" onClick={() => handleDigitClick("0")}>
              0
            </div>
            <div className="key small" onClick={handleDelete}>
              Delete
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: hint + attempts */}
      <div className="lock-text-box">
        <div className="story-text">
          <p style={{ opacity: 0.8, fontSize: "14px", marginBottom: "8px" }}>
            Passcode Hint
          </p>

          {selectedHintParagraph ? (
            <p>{selectedHintParagraph}</p>
          ) : (
            <p>No hint available.</p>
          )}

          <p style={{ marginTop: "16px", opacity: 0.85 }}>
            Attempts: {attempts} / 5
          </p>

          {errorMsg && (
            <p style={{ color: "#ff6666", marginTop: "8px" }}>{errorMsg}</p>
          )}
        </div>
      </div>
    </div>
  );
}