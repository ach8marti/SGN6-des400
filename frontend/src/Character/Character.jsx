import React, { useEffect, useState } from "react"; // Ensure useState and useEffect are imported
import "./Character.css";

export default function Character() {
  const [suspects, setSuspects] = useState([]); // Initialize state for suspects
  const [loading, setLoading] = useState(true); // Initialize state for loading

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
    return <div>Loading...</div>; // Show loading state while fetching data
  }

  if (suspects.length === 0) {
    return <div>No suspects found</div>; // Handle case where no suspects are returned
  }

  return (
    <div className="character-page">
      <h1 className="title">Suspects</h1>

      <div className="suspect-grid">
        {suspects.map((suspect, index) => (
          <div className="suspect-card" key={index}>
            <div className="suspect-img">
              <img src={suspect.image} alt={"suspectImage"} />
            </div>
            <div className="suspect-info">
              <p>Name: {suspect.name}</p>
              <p>Role: {suspect.role}</p>
              <p>Trust: {suspect.trust}</p>
              <p>Relation: {suspect.relation}</p>
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