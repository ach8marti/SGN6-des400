import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Investigate.css";
import { increaseInterrogation, canInvestigateMore } from "../gameState";

export default function Investigate() {
  const { suspectId } = useParams();
  const navigate = useNavigate();
  const [suspect, setSuspect] = useState(null);
  const [imgError, setImgError] = useState(false);

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

  // Build investigate path - always use .png extension
  let img;
  if (suspect.image.includes("/pics/suspect/")) {
    // Extract filename and change extension to .png
    const filename = suspect.image.split("/").pop().split(".")[0]; // Get name without extension
    img = `/pics/investigate/${filename}.png`;
  } else {
    // Fallback: get last part of path and force .png
    const filename = suspect.image.split("/").pop().split(".")[0];
    img = `/pics/investigate/${filename}.png`;
  }

  console.log("Suspect image:", suspect.image);
  console.log("Investigate image:", img);

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
        <img
          src={imgError ? suspect.image : img}
          alt={suspect.name}
          onError={(e) => {
            console.error("Investigate image failed:", img);
            if (!imgError) {
              setImgError(true);
            }
          }}
        />
      </div>
      <div className="dialogue-box">
        <p>I– I didn't go anywhere... I stayed home...</p>
      </div>
      <div className="choices">
        <button onClick={ask}>What were you hiding?</button>
        <button onClick={ask}>Why so nervous?</button>
        <button onClick={ask}>Where were you last night?</button>
      </div>
    </div>
  );
}