import React, { useEffect, useState } from "react";
import "./Character.css";

export default function Character() {
  const [suspects, setSuspects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuspects = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/suspects");
        const data = await response.json();

        setSuspects(data);
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

  if (!suspects || suspects.length === 0) {
    return <div>No suspects found</div>;
  }

  return (
    <div className="character-page">
      <h1 className="title">Suspects</h1>

      <div className="suspect-grid">
        {suspects.map((suspect, index) => (
          <div className="suspect-card" key={suspect.id || index}>
            <div className="suspect-img">
              {/* 
                ถ้าไฟล์รูปอยู่ใน frontend/public/images/S1.jpg แบบนี้
                ให้ใช้ /images/${suspect.image}
              */}
              <img
                src={`/images/${suspect.image}`}
                alt={suspect.name}
              />
            </div>

            <div className="suspect-info">
              <p><strong>Name:</strong> {suspect.name}</p>
              <p><strong>Role:</strong> {suspect.role}</p>
              <p><strong>Trust:</strong> {suspect.trust}</p>
              <p><strong>Relation:</strong> {suspect.relation}</p>
              <p><strong>Suspicion:</strong> {suspect.suspicion}</p>
              <p>
                <strong>Traits:</strong>{" "}
                {Array.isArray(suspect.traits)
                  ? suspect.traits.join(", ")
                  : suspect.traits}
              </p>
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