import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Investigate.css";
import { increaseInterrogation, canInvestigateMore } from "../gameState";

export default function Investigate() {
  const { suspectId } = useParams();
  const navigate = useNavigate();
  const [suspect, setSuspect] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("http://localhost:3001/api/suspects");
      const list = await res.json();
      const found = list.find((s) => String(s.id) === String(suspectId));
      setSuspect(found || null);
    };
    load();
  }, [suspectId]);

  if (!suspect) return <div>Loading...</div>;

  const img = suspect.image.replace("/pics/suspect/", "/pics/investigate/");

  const ask = () => {
    if (!canInvestigateMore()) {
      alert("No investigation attempts left.");
      return;
    }
    increaseInterrogation();
    navigate(-1);
  };

  return (
    <div className="investigate-page">
      <div className="info-frame">
        <div className="profile-frame">
          <img src={suspect.image} alt={suspect.name} />
        </div>
        <div className="text-info">
          <h2>{suspect.name}</h2>
          <p>
            {suspect.role} / {suspect.relation}
          </p>
        </div>
      </div>

      <div className="image-frame">
        <img src={img} alt={suspect.name} />
      </div>

      <div className="dialogue-box">
        <p>I– I didn’t go anywhere... I stayed home...</p>
      </div>

      <div className="choices">
        <button onClick={ask}>What were you hiding?</button>
        <button onClick={ask}>Why so nervous?</button>
        <button onClick={ask}>Where were you last night?</button>
      </div>
    </div>
  );
}