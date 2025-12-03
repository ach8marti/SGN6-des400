// src/Character/Character.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Character.css";
import TopIcons from "../Phone/TopIcons";
import { loadGame, canInvestigateMore } from "../gameState";

export default function Character() {
  const navigate = useNavigate();
  const [suspects, setSuspects] = useState([]);
  const [canInvestigate, setCanInvestigate] = useState(true);

  useEffect(() => {
    const gs = loadGame();
    setSuspects(gs.suspects || []);
    setCanInvestigate(canInvestigateMore());
  }, []);

  const openInvestigate = (id) => {
    if (!canInvestigate) return;
    navigate(`/investigate/${id}`);
  };

  return (
    <div className="character-page">
      <TopIcons />
      <h1 className="title">Suspects</h1>

      <div className="suspect-grid">
        {suspects.map((s, i) => (
          <div
            key={i}
            className="suspect-card"
            onClick={() => openInvestigate(s.id)}
            style={{
              opacity: canInvestigate ? 1 : 0.5,
              pointerEvents: canInvestigate ? "auto" : "none",
              position: "relative",
            }}
          >
            <div className="suspect-img">
              <img src={s.image} alt={s.name} />
            </div>

            {!canInvestigate && (
              <div
                style={{
                  position: "absolute",
                  top: "6px",
                  right: "10px",
                  fontSize: "26px",
                  color: "#fff",
                  textShadow: "0 0 6px #000",
                }}
              >
                🔒
              </div>
            )}

            <div className="suspect-info">
              <p>{s.name}</p>
              <p>Role: {s.role}</p>
              <p>Relation: {s.relation}</p>
              <p>Trust: {s.trust}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="back-button" onClick={() => navigate(-1)}>
        ‹ Back
      </div>
    </div>
  );
}