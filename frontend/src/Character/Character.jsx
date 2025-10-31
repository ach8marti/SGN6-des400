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

  return (
    <div className="character-page">
      <h1 className="title">Suspects</h1>

      <div className="suspect-grid">
        {/* Row 1 */}
        <div className="suspect-card">
          <div className="suspect-img"></div>
          <div className="suspect-info">
            <p>Name</p>
            <p>Role:</p>
            <p>Trust:</p>
            <p>Relation:</p>
            <p>Suspicion:</p>
            <p>Trait:</p>
          </div>
        </div>

        <div className="suspect-card">
          <div className="suspect-img"></div>
          <div className="suspect-info">
            <p>Name</p>
            <p>Role:</p>
            <p>Trust:</p>
            <p>Relation:</p>
            <p>Suspicion:</p>
            <p>Trait:</p>
          </div>
        </div>

        {/* Row 2 */}
        <div className="suspect-card">
          <div className="suspect-img"></div>
          <div className="suspect-info">
            <p>Name</p>
            <p>Role:</p>
            <p>Trust:</p>
            <p>Relation:</p>
            <p>Suspicion:</p>
            <p>Trait:</p>
          </div>
        </div>

        <div className="suspect-card">
          <div className="suspect-img"></div>
          <div className="suspect-info">
            <p>Name</p>
            <p>Role:</p>
            <p>Trust:</p>
            <p>Relation:</p>
            <p>Suspicion:</p>
            <p>Trait:</p>
          </div>
        </div>

        {/* Row 3 */}
        <div className="suspect-card">
          <div className="suspect-img"></div>
          <div className="suspect-info">
            <p>Name</p>
            <p>Role:</p>
            <p>Trust:</p>
            <p>Relation:</p>
            <p>Suspicion:</p>
            <p>Trait:</p>
          </div>
        </div>
      </div>

      <div className="next-button">
        <span>Next</span>
        <span className="arrow">›</span>
      </div>
    </div>
  );
}
