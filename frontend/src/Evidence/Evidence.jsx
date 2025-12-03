// src/Evidence/Evidence.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Evidence.css";
import TopIcons from "../Phone/TopIcons.jsx";

import {
  loadGame,
  saveGame,
  lockEvidenceAssignments,
  getEvidenceForDisplay,
} from "../gameState";

export default function Evidence() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvidence, setSelectedEvidence] = useState(null);

  const isSelectionMode = searchParams.get("mode") === "select";

  useEffect(() => {
    const loadData = async () => {
      try {
        const gs = loadGame();

        const evidenceRes = await fetch("http://localhost:3001/api/evidence");
        const evidenceList = await evidenceRes.json();

        // --- 1) If no assignment → assign once
        if (!gs.evidenceAssignments || Object.keys(gs.evidenceAssignments).length === 0) {
          lockEvidenceAssignments(evidenceList);
        }

        // --- 2) Prepare evidence blocks for UI
        const display = getEvidenceForDisplay(evidenceList);
        setEvidence(display);

        saveGame(loadGame()); // ensure save
      } catch (err) {
        console.error("Evidence load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSelectEvidence = (item) => {
    if (isSelectionMode && item.isUnlocked) {
      setSelectedEvidence(item);
    }
  };

  const handleDone = () => {
    if (isSelectionMode) {
      navigate("/killer", {
        state: { selectedEvidence },
      });
    } else {
      navigate(-1);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="page evidence-page">
      <TopIcons />

      {isSelectionMode && (
        <div className="selection-header">
          <h2>Select Evidence for Your Accusation</h2>
        </div>
      )}

      {/* Evidence Frames */}
      <div className="evidence-grid">
        {evidence.slice(0, 4).map((ev, idx) => (
          <div
            key={ev.id}
            className={`evidence-card 
              ${ev.isUnlocked ? "selectable" : ""}
              ${selectedEvidence?.id === ev.id ? "selected" : ""}
            `}
            onClick={() => handleSelectEvidence(ev)}
          >
            <div className={`evidence-frame ${!ev.isUnlocked ? "locked-slot" : ""}`}>
              {ev.isUnlocked ? (
                <img src={`/pics/evidence/${ev.id}.png`} alt="ev" />
              ) : (
                <div className="locked-inner">
                  <span className="locked-icon">🔒</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Descriptions */}
      <div className="description-frame">
        {evidence.slice(0, 4).map((ev) => (
          <div key={ev.id} className="description-item">
            {ev.isUnlocked ? (
              <p>{ev.description}</p>
            ) : (
              <p className="locked-text">EVIDENCE LOCKED</p>
            )}
          </div>
        ))}
      </div>

      <button
        className="done-button"
        disabled={isSelectionMode && !selectedEvidence}
        onClick={handleDone}
      >
        {isSelectionMode ? "Confirm Selection" : "Done"}
      </button>
    </div>
  );
}