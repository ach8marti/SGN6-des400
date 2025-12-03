import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Character.css";
import TopIcons from "../Phone/TopIcons";
import { loadGame, lockSuspects, getLockedSuspects } from "../gameState";

export default function Character() {
  const navigate = useNavigate();
  const [suspects, setSuspects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const locked = getLockedSuspects();
      if (locked.length > 0) {
        setSuspects(locked);
        setLoading(false);
        return;
      }
      try {
        const storyRaw = localStorage.getItem("currentStory");
        const story = storyRaw ? JSON.parse(storyRaw) : {};
        const storyType = story.type || "university";
        const res = await fetch(
          `http://localhost:3001/api/suspects?type=${storyType}`
        );
        const data = await res.json();
        const finalLocked = lockSuspects(data.slice(0, 5));
        setSuspects(finalLocked);
      } catch (e) {}
      setLoading(false);
    };
    init();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="character-page">
      <TopIcons />
      <h1 className="title">Suspects</h1>
      <div className="suspect-grid">
        {suspects.map((s) => (
          <div
            key={s.id}
            className="suspect-card"
            onClick={() => navigate(`/investigate/${s.id}`)}
          >
            <div className="suspect-img">
              <img src={s.image} alt={s.name} />
            </div>
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