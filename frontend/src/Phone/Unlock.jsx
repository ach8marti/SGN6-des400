// src/Phone/Unlock.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Phone.css";

export default function Unlock() {
  const navigate = useNavigate();

  const [story, setStory] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [input, setInput] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  // Load story from localStorage and decide which passcode/hint to use
  useEffect(() => {
    const saved = localStorage.getItem("currentStory");
    if (!saved) {
      navigate("/lock");
      return;
    }

    try {
      const parsedStory = JSON.parse(saved);
      setStory(parsedStory);

      // PRIMARY: if backend already chose one pair, use that
      if (
        parsedStory.selectedPasscode &&
        parsedStory.selectedPasscodeHintParagraph
      ) {
        // Keep index if provided, otherwise default to 0
        const idx =
          typeof parsedStory.selectedPasscodeIndex === "number"
            ? parsedStory.selectedPasscodeIndex
            : 0;
        setSelectedIndex(idx);
        return;
      }

      // FALLBACK: compute a random index from passcode[] + passcodeHintParagraph[]
      const codes = Array.isArray(parsedStory.passcode)
        ? parsedStory.passcode
        : [];
      const hints = Array.isArray(parsedStory.passcodeHintParagraph)
        ? parsedStory.passcodeHintParagraph
        : [];

      const maxPairs = Math.min(codes.length, hints.length);

      if (maxPairs > 0) {
        const randomIdx = Math.floor(Math.random() * maxPairs);
        setSelectedIndex(randomIdx);
      } else if (codes.length > 0) {
        setSelectedIndex(0);
      } else {
        console.warn("Story has no passcode defined:", parsedStory);
        setSelectedIndex(-1);
      }
    } catch (err) {
      console.error("Failed to parse currentStory from localStorage:", err);
      navigate("/lock");
    }
  }, [navigate]);

  // Loading or invalid state
  if (!story || selectedIndex === -1) {
    return (
      <div className="lock-page">
        <div className="lock-phone">
          <div
            className="lock-phone-screen"
            style={{ backgroundImage: "url('/pics/Wallpaper.jpg')" }}
          >
            <div className="passcode-wrap">
              <div className="passcode-title">Enter Passcode</div>
            </div>
          </div>
        </div>
        <div className="lock-text-box">
          <div className="story-text">
            <p>Loading passcode data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Derive passcode + hint
  const codes = Array.isArray(story.passcode) ? story.passcode : [];
  const hints = Array.isArray(story.passcodeHintParagraph)
    ? story.passcodeHintParagraph
    : [];

  // Prefer backend's selectedPasscode if exists
  const backendPasscode = story.selectedPasscode
    ? String(story.selectedPasscode)
    : null;
  const backendHint = story.selectedPasscodeHintParagraph || null;

  const fallbackPasscode = codes[selectedIndex]
    ? String(codes[selectedIndex])
    : "";
  const fallbackHint =
    hints[selectedIndex] && hints[selectedIndex].length > 0
      ? hints[selectedIndex]
      : null;

  const selectedPasscode = backendPasscode || fallbackPasscode;
  const selectedHintParagraph = backendHint || fallbackHint;

  const passcodeLength = selectedPasscode
    ? selectedPasscode.length
    : 6;

  const checkPasscode = (code) => {
    if (!selectedPasscode) {
      setErrorMsg("Passcode not available. Please restart the case.");
      return;
    }

    if (code === selectedPasscode) {
      navigate("/messages", { state: { story } });
    } else {
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
    if (input.length >= passcodeLength) return;

    const newInput = input + digit;
    setInput(newInput);

    if (newInput.length === passcodeLength) {
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
              {Array.from({ length: passcodeLength }).map((_, i) => (
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