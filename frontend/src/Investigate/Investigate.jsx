import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Investigate.css";
import { increaseInterrogation, canInvestigateMore } from "../gameState";

export default function Investigate() {
  const { suspectId } = useParams();
  const navigate = useNavigate();
  const [suspect, setSuspect] = useState(null);
  const [imgError, setImgError] = useState(false);
  const [dialogue, setDialogue] = useState(null);
  const [showChoices, setShowChoices] = useState(true);

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
    const filename = suspect.image.split("/").pop().split(".")[0];
    img = `/pics/investigate/${filename}.png`;
  } else {
    const filename = suspect.image.split("/").pop().split(".")[0];
    img = `/pics/investigate/${filename}.png`;
  }

  console.log("Suspect image:", suspect.image);
  console.log("Investigate image:", img);

  const ask = (question, response) => {
    if (!canInvestigateMore()) {
      alert("No investigation attempts left.");
      return;
    }

    // Show the dialogue
    setDialogue(response);
    setShowChoices(false);

    // Increase interrogation count
    increaseInterrogation();

    // Go back after showing dialogue
    setTimeout(() => {
      navigate(-1);
    }, 3000); // Wait 3 seconds before going back
  };

  // Define responses for each question (you can customize these per suspect)
  const responses = {
    hiding: "I– I wasn't hiding anything! Why would you think that?",
    nervous: "N-nervous? I'm not nervous... It's just... this whole situation is scary.",
    whereabouts: "I– I didn't go anywhere... I stayed home all night, I swear!"
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

      {dialogue && (
        <div className="dialogue-box">
          <p>{dialogue}</p>
        </div>
      )}

      {showChoices && (
        <div className="choices">
          <button onClick={() => ask("hiding", responses.hiding)}>
            What were you hiding?
          </button>
          <button onClick={() => ask("nervous", responses.nervous)}>
            Why so nervous?
          </button>
          <button onClick={() => ask("whereabouts", responses.whereabouts)}>
            Where were you last night?
          </button>
        </div>
      )}
    </div>
  );
}