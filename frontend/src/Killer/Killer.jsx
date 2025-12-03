// src/Killer/Killer.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Killer.css";

export default function Killer() {
  const navigate = useNavigate();
  const [suspects, setSuspects] = useState([]);
  const [selectedSuspect, setSelectedSuspect] = useState(null);
  const [loading, setLoading] = useState(true);

  const realKiller = "Liam";

  useEffect(() => {
    const fetchSuspects = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/suspects");
        const data = await res.json();
        setSuspects(data.slice(0, 5));
      } catch (err) {
        console.error("Error fetching suspects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuspects();
  }, []);

  if (loading) return <div>Loading...</div>;

  const handleSelect = (sus) => {
    console.log("Selected suspect:", sus);
    setSelectedSuspect(sus);
  };

  const handleSubmit = () => {
    if (!selectedSuspect) return;

    console.log("Submitting selection:", selectedSuspect);

    if (selectedSuspect.name === realKiller) {
      navigate("/good-end", { state: { suspect: selectedSuspect } });
    } else {
      navigate("/bad-end", { state: { suspect: selectedSuspect } });
    }
  };

  return (
    <div className="killer-page">
      <div className="header-banner">
        <h1>Who is the killer?</h1>
      </div>

      {/* SUSPECT ROW */}
      <div className="suspect-row">
        {suspects.map((sus) => (
          <div
            key={sus.id}
            className={`suspect-box ${
              selectedSuspect?.id === sus.id ? "selected" : ""
            }`}
            onClick={() => handleSelect(sus)}
            style={{ cursor: "pointer" }}
          >
            <div className="suspect-img">
              <img src={sus.image} alt={sus.name} />
            </div>
            <p className="suspect-name">{sus.name}</p>
          </div>
        ))}
      </div>

      {/* SUBMIT BUTTON */}
      <button
        className="accuse-button"
        onClick={handleSubmit}
        disabled={!selectedSuspect}
        style={{
          marginTop: "40px",
          padding: "18px 30px",
          background: "#C12020",
          color: "white",
          borderRadius: "14px",
          fontSize: "22px",
          border: "2px solid #ffcccc",
          boxShadow: "0 0 14px rgba(255,0,0,0.7)",
          opacity: selectedSuspect ? 1 : 0.3,
          cursor: selectedSuspect ? "pointer" : "not-allowed",
          transition: "0.2s",

          /* 🔥 FIX BUTTON CLICK OVERLAY BUG 🔥 */
          position: "relative",
          zIndex: 999999,
          pointerEvents: "auto",
        }}
      >
        Submit Accusation
      </button>
    </div>
  );
}