import React, { useEffect, useState } from "react";
import "./Character.css";

export default function Character() {
  const [suspects, setSuspects] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const savedStory = JSON.parse(localStorage.getItem("currentStory"));
        const type = savedStory?.type || "university";

        const res = await fetch(
          `http://localhost:3001/api/suspects?type=${type}`
        );
        const data = await res.json();

        // ถ้าอยากได้ 5 คนต่อเกม
        setSuspects(data.slice(0, 5));
      } catch (err) {
        console.error("Error fetching suspects:", err);
      }
    };

    load();
  }, []);

  if (!suspects.length) {
    return <div className="character-page">Loading suspects...</div>;
  }

  return (
    <div className="character-page">
      <h1 className="title">Suspects</h1>
      <div className="suspect-grid">
        {suspects.map((suspect, index) => (
          <div className="suspect-card" key={index}>
            <div className="suspect-img">
              <img src={suspect.image} alt={suspect.name} />
            </div>
            <div className="suspect-info">
              <p>Name: {suspect.name}</p>
              <p>Role: {suspect.role}</p>
              <p>Relation: {suspect.relation}</p>
              <p>Trust: {suspect.trust}</p>
              <p>Suspicion: {suspect.suspicion}</p>
              <p>
                Traits:{" "}
                {Array.isArray(suspect.traits)
                  ? suspect.traits.join(", ")
                  : suspect.traits}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}