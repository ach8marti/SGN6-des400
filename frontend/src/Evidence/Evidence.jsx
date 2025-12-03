// src/Evidence/Evidence.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Evidence.css";
import TopIcons from "../Phone/TopIcons";
import {
  lockEvidenceAssignments,
  getEvidenceForDisplay,
  loadGame,
  saveGame,
} from "../gameState";

export default function Evidence() {
  const navigate = useNavigate();
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/evidence");
        const list = await res.json();

        lockEvidenceAssignments(list);
        const display = getEvidenceForDisplay(list);
        setEvidence(display);

        saveGame(loadGame());
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="page evidence-page">
      <TopIcons />

      <div className="evidence-grid">
        {evidence.map((ev) => (
          <div
            key={ev.id}
            className={`evidence-card ${
              ev.isUnlocked ? "selectable" : ""
            }`}
          >
            <div
              className={`evidence-frame ${
                !ev.isUnlocked ? "locked-slot" : ""
              }`}
            >
              {ev.isUnlocked ? (
                <img src={ev.imagePath} alt="ev" />
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
        {evidence.map((ev) => (
          <div key={ev.id} className="description-item">
            {ev.isUnlocked ? (
              <p>{ev.description}</p>
            ) : (
              <p className="locked-text">EVIDENCE LOCKED</p>
            )}
          </div>
        ))}
      </div>

      <button className="done-button" onClick={() => navigate(-1)}>
        Done
      </button>
    </div>
  );
}