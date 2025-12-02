// src/Character/Character.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Character.css";
import TopIcons from "../Phone/TopIcons";

export default function Character() {
  const [suspects, setSuspects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuspects = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/suspects");
        const data = await res.json();

        // สุ่มแล้วเอาแค่ 5 คน
        const shuffled = data.sort(() => Math.random() - 0.5);
        setSuspects(shuffled.slice(0, 5));
      } catch (err) {
        console.error("Error fetching suspects:", err);
      }
    };

    fetchSuspects();
  }, []);

  const handleBack = () => {
    navigate(-1); // Goes back one page in history
  };

  // ถ้าได้มาน้อยกว่า 5 ให้ใส่ null เติม จะได้ layout คงที่
  const slots = [...suspects];
  while (slots.length < 5) {
    slots.push(null);
  }

  return (
    <div className="character-page">
      <TopIcons />
      <h1 className="title">Suspects</h1>

      <div className="suspect-grid">
        {slots.slice(0, 5).map((suspect, index) => (
          <div className="suspect-card" key={index}>
            <div className="suspect-img">
              {suspect && (
                <img 
                  src={suspect.image}
                  alt={suspect.name || "suspect"} 
                  onError={(e) => {
                    console.error(`Failed to load image: ${suspect.image}`);
                  }}
                />
              )}
            </div>

            <div className="suspect-info">
              <p>{suspect?.name || "-"}</p>
              <p>Role: {suspect?.role || "-"}</p>
              <p>Trust: {suspect?.trust || "-"}</p>
              <p>Relation: {suspect?.relation || "-"}</p>
              <p>Suspicion: {suspect?.suspicion || "-"}</p>
              <p>Trait: {suspect?.traits?.join(", ") || "-"}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="back-button" onClick={handleBack}>
        ‹ Back
      </div>
    </div>
  );
}