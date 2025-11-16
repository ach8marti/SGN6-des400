import React, { useEffect, useState } from "react";
import "./Character.css";

export default function Character() {
  const [suspects, setSuspects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuspects = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/suspects"); // Fetch from backend
        const data = await response.json();

        // Shuffle the suspects array and take the first 5
        const shuffled = data.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 5);

        setSuspects(selected);
      } catch (error) {
        console.error("Error fetching suspects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSuspects();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="character-page">
      <h1 className="title">Suspects</h1>

      <div className="suspect-grid">
        {suspects.map((suspect, index) => (
          <div className="suspect-card" key={index}>
            <div className="suspect-img"></div>
            <div className="suspect-info">
              <p>Name: {suspect.name}</p>
              <p>Role: {suspect.role}</p>
              <p>Profile: {suspect.profile}</p>
              <p>Suspicion: {suspect.suspicion}</p>
              <p>Trait: {Array.isArray(suspect.traits) ? suspect.traits.join(", ") : suspect.traits}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="next-button">
        <span>Next</span>
        <span className="arrow">›</span>
      </div>
    </div>
  );
}