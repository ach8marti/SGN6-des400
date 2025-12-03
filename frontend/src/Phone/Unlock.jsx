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

  // 🔥 ดึง story ใหม่จาก backend ทุกครั้งที่เข้า /unlock
  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/story");
        const data = await res.json();

        // เก็บ story ใหม่ใน localStorage เผื่อหน้าอื่นใช้
        localStorage.setItem("currentStory", JSON.stringify(data));
        setStory(data);

        // ถ้า backend ยิง selectedPasscodeIndex มาแล้ว → ใช้อันนั้น
        if (typeof data.selectedPasscodeIndex === "number") {
          setSelectedIndex(data.selectedPasscodeIndex);
          return;
        }

        // ถ้าไม่ได้ส่ง index มาก็สุ่มเองจาก passcode[] + hint[]
        const codes = Array.isArray(data.passcode) ? data.passcode : [];
        const hints = Array.isArray(data.passcodeHintParagraph)
          ? data.passcodeHintParagraph
          : [];
        const maxPairs = Math.min(codes.length, hints.length);

        if (maxPairs > 0) {
          const randomIdx = Math.floor(Math.random() * maxPairs);
          setSelectedIndex(randomIdx);
        } else if (codes.length > 0) {
          setSelectedIndex(0);
        } else {
          console.warn("Story has no passcode defined:", data);
          setSelectedIndex(-1);
        }
      } catch (err) {
        console.error("Failed to load story:", err);
        setErrorMsg("Failed to load story. Please try again.");
      }
    };

    fetchStory();
  }, []);

  // ยังโหลด story / index อยู่
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
            {errorMsg && <p style={{ color: "#ff6666" }}>{errorMsg}</p>}
          </div>
        </div>
      </div>
    );
  }

  // ----- ดึง passcode + hint ตาม index -----
  const codes = Array.isArray(story.passcode) ? story.passcode : [];
  const hints = Array.isArray(story.passcodeHintParagraph)
    ? story.passcodeHintParagraph
    : [];

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

  const passcodeLength = selectedPasscode ? selectedPasscode.length : 6;

  // ----- logic ตรวจ passcode -----
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

      {/* RIGHT: hint box */}
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