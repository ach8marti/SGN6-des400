import React, { useEffect, useState } from "react";
import "./Evidence.css";

export default function Evidence() {
  const [evidence, setEvidence] = useState([]); // Initialize state for evidence
  const [loading, setLoading] = useState(true); // Initialize state for loading

  useEffect(() => {
    const fetchEvidence = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/evidence"); // Fetch from backend
        const data = await response.json();
        console.log("Fetched evidence:", data); // Debugging: Log the data
        
        // Shuffle the evidence array and take first 4 items
        const shuffledEvidence = shuffleArray(data).slice(0, 4);
        setEvidence(shuffledEvidence);
      } catch (error) {
        console.error("Error fetching evidence:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvidence();
  }, []);

  // Fisher-Yates shuffle algorithm to randomize array
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading state while fetching data
  }

  if (evidence.length === 0) {
    return <div>No evidence found</div>; // Handle case where no evidence is returned
  }

  return (
    <div className="page evidence-page">
      {/* Top half: Evidence grid */}
      <div className="evidence-grid">
        {evidence.map((item, index) => (
          <div className="evidence-card" key={index}>
            <div className="evidence-frame">
              <img src={item.image} alt={"Evidence Image"}/>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom half: Descriptions */}
      <div className="description-frame">
        {evidence.map((item, index) => (
          <div className="description-item" key={index}>
            <p>{item.summaryTemplate}</p>
          </div>
        ))}
      </div>

      {/* Done button */}
      <button className="done-button">
        Done
      </button>
    </div>
  );
}