// src/Investigate/Investigate.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Investigate.css";
import { increaseInterrogation, canInvestigateMore } from "../gameState";

export default function Investigate() {
  const { suspectId } = useParams();
  const navigate = useNavigate();

  const [suspect, setSuspect] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // -----------------------------
  // Load suspect from backend
  // -----------------------------
  useEffect(() => {
    const fetchSuspect = async () => {
      try {
        console.log("🔍 Fetching suspects...");
        const res = await fetch("http://localhost:3001/api/suspects");
        if (!res.ok) throw new Error("Failed to fetch suspects");

        const list = await res.json();
        console.log("✅ Suspect list:", list);

        const found = list.find(
          (s) => String(s.id) === String(suspectId)
        );
        console.log("🎯 Found suspect:", found);

        if (!found) throw new Error("Suspect not found");
        setSuspect(found);
      } catch (err) {
        console.error("❌ Investigate load error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSuspect();
  }, [suspectId]);

  // -----------------------------
  // Handle asking a question
  // -----------------------------
  const handleAsk = () => {
    if (!canInvestigateMore()) {
      alert("❗ You already used all 2 investigation attempts.");
      return;
    }

    increaseInterrogation();
    alert("🕵️ Investigation count increased!");
    navigate(-1);
  };

  // -----------------------------
  // UI rendering
  // -----------------------------
  if (loading)
    return <div style={{ color: "white", padding: "50px" }}>Loading suspect data...</div>;

  if (error)
    return (
      <div style={{ color: "white", padding: "50px" }}>
        ❌ {error}
        <br />
        <button onClick={() => navigate(-1)} style={{ marginTop: "10px" }}>
          Go Back
        </button>
      </div>
    );

  if (!suspect)
    return (
      <div style={{ color: "white", padding: "50px" }}>
        Suspect not found.
        <button onClick={() => navigate(-1)}>Back</button>
      </div>
    );

  const investigateImg = suspect.image.replace(
    "/pics/suspect/",
    "/pics/investigate/"
  );

  return (
    <div className="investigate-page">
      {/* Character Info */}
      <div className="info-frame">
        <div className="profile-frame">
          <img src={suspect.image} alt={suspect.name} />
        </div>
        <div className="text-info">
          <h2>{suspect.name}</h2>
          <p>
            {suspect.role} / {suspect.relation}
          </p>
          <p>Trust: {suspect.trust}</p>
        </div>
      </div>

      {/* Large Image */}
      <div className="image-frame">
        <img src={investigateImg} alt={suspect.name} />
      </div>

      {/* Dialogue */}
      <div className="dialogue-box">
        <p>I– I didn’t go anywhere... I stayed home...</p>
      </div>

      {/* Choices */}
      <div className="choices">
        <button onClick={handleAsk}>What were you hiding?</button>
        <button onClick={handleAsk}>Why so nervous?</button>
        <button onClick={handleAsk}>Where were you last night?</button>
      </div>
    </div>
  );
}