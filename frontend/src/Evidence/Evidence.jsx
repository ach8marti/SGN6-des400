import React, { useEffect, useState } from "react";
import "./Evidence.css";

export default function Evidence() {
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvidence = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/evidence");
        const data = await response.json();
        console.log("Fetched evidence:", data); // Debugging: Log the data
        setEvidence(data.slice(0, 4)); // Limit to 4 evidence items
      } catch (error) {
        console.error("Error fetching evidence:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvidence();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (evidence.length === 0) {
    return <div>No evidence found</div>;
  }

  return (
    <div className="evidence-page">
      {/* Top half: Evidence grid */}
      <div className="evidence-grid">
        {evidence.map((item, index) => (
          <div className="evidence-card" key={index}>
            <div className="evidence-frame">
              <img src={item.image} alt={ "Evidence Image" } />
            </div>
            <h2>{item.title}</h2>
          </div>
        ))}
      </div>

      {/* Bottom half: Descriptions */}
      <div className="description-list">
        {evidence.map((item, index) => (
          <div className="description-item" key={index}>
            <p className="description-text">{item.summaryTemplate}</p>
          </div>
        ))}
      </div>
    </div>
  );
}