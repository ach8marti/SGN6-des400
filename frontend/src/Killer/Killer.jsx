import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Killer.css";

export default function Killer() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedSuspect, setSelectedSuspect] = useState(null);
  const [suspects, setSuspects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get selected evidence from navigation state
  const selectedEvidence = location.state?.selectedEvidence;

  useEffect(() => {
    const fetchSuspects = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/suspects");
        const data = await response.json();
        setSuspects(data.slice(0, 5)); // Show first 5 suspects
      } catch (error) {
        console.error("Error fetching suspects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuspects();
  }, []);

  const handleSelectSuspect = (suspect) => {
    setSelectedSuspect(suspect);
  };

  const handleReasonClick = () => {
    // Navigate to evidence in selection mode
    navigate("/evidence?mode=select");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="killer-page">
      <div className="header-banner">
        <h1>Choose the killer and give a reason</h1>
      </div>

      <div className="suspect-row">
        {suspects.map((suspect) => (
          <div
            key={suspect.id}
            className={`suspect-box ${
              selectedSuspect?.id === suspect.id ? "selected" : ""
            }`}
            onClick={() => handleSelectSuspect(suspect)}
          >
            <div className="suspect-img">
              <img src={suspect.image} alt={suspect.name} />
            </div>
            <p>{suspect.name}</p>
          </div>
        ))}
      </div>

      <div className="reason-box" onClick={handleReasonClick}>
        {selectedEvidence ? (
          <p>Evidence: {selectedEvidence.description}</p>
        ) : (
          <p>Give us your reason...</p>
        )}
      </div>
    </div>
  );
}