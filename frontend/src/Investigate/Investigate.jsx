import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Investigate.css";

export default function Investigate() {
  const { suspectId } = useParams();
  const navigate = useNavigate();
  const [suspect, setSuspect] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuspect = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/suspects");
        const suspects = await response.json();
        
        const foundSuspect = suspects.find(s => s.id === suspectId);
        
        if (foundSuspect) {
          setSuspect(foundSuspect);
        }
      } catch (error) {
        console.error("Error fetching suspect:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuspect();
  }, [suspectId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!suspect) {
    return <div>Suspect not found</div>;
  }

  // Get the investigate image (from /pics/investigate/)
  const investigateImage = suspect.image.replace('/pics/suspect/', '/pics/investigate/');

  return (
    <div className="investigate-page">
      {/* Character Info Frame */}
      <div className="info-frame">
        <div className="profile-frame">
          <img src={suspect.image} alt={suspect.name} />
        </div>
        <div className="text-info">
          <h2>{suspect.name}</h2>
          <p>{suspect.role} / {suspect.relation}</p>
          <p>Trust {suspect.trust}</p>
        </div>
      </div>

      {/* Image / Character Frame */}
      <div className="image-frame">
        <img src={investigateImage} alt={suspect.name} />
      </div>

      {/* Dialogue Box */}
      <div className="dialogue-box">
        <p>
          I—I was home, I swear. I didn't go anywhere... I just stayed inside.
        </p>
      </div>

      {/* Choice Buttons */}
      <div className="choices">
        <button>What were you hiding from them?</button>
        <button>If you're innocent, why are you so nervous?</button>
        <button>Where exactly were you last night?</button>
      </div>

      <button className="back-button" onClick={() => navigate(-1)}>
        Back to Suspects
      </button>
    </div>
  );
}
