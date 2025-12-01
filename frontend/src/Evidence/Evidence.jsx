import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Evidence.css";
import TopIcons from "../Phone/TopIcons.jsx";

export default function Evidence() {
  const navigate = useNavigate();

  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const flag =
      typeof window !== "undefined" &&
      localStorage.getItem("evidenceUnlocked") === "true";
    setUnlocked(flag);
  }, []);

  useEffect(() => {
    const fetchEvidence = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/evidence");
        const data = await response.json();

        const shuffled = [...data];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        setEvidence(shuffled.slice(0, 4));
      } catch (error) {
        console.error("Error fetching evidence:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvidence();
  }, []);

  const handleDone = () => {
    navigate("/messages");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const slots = unlocked ? evidence : [0, 1, 2, 3];

  return (
    <div className="page evidence-page">
      <TopIcons />
      <div className="evidence-grid">
        {slots.map((item, index) => (
          <div className="evidence-card" key={index}>
            <div className={`evidence-frame ${!unlocked ? "locked-slot" : ""}`}>
              {unlocked ? (
                <img src={item.image} alt="Evidence" />
              ) : (
                <div className="locked-inner">
                  <span className="locked-icon">🔒</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="description-frame">
        {slots.map((item, index) => (
          <div className="description-item" key={index}>
            {unlocked ? (
              <p>{item.summaryTemplate}</p>
            ) : (
              <p className="locked-text">EVIDENCE LOCKED</p>
            )}
          </div>
        ))}
      </div>

      <button className="done-button" onClick={handleDone}>
        Done
      </button>
    </div>
  );
}