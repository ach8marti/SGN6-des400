import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Evidence.css";
import TopIcons from "../Phone/TopIcons.jsx";

export default function Evidence() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  
  // Check if we're in selection mode
  const isSelectionMode = searchParams.get("mode") === "select";

  useEffect(() => {
    const fetchEvidence = async () => {
      try {
        const [evidenceResponse, suspectsResponse] = await Promise.all([
          fetch("http://localhost:3001/api/evidence"),
          fetch("http://localhost:3001/api/suspects"),
        ]);
        const evidenceData = await evidenceResponse.json();
        const suspectsData = await suspectsResponse.json();

        const shuffled = [...evidenceData];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        const imageFiles = [
          "/pics/evidence/e1.png",
          "/pics/evidence/e2.png",
        ];

        const selected = shuffled.slice(0, 4).map((item, index) => {
          let description = item.summaryTemplate;
          const randomSuspect =
            suspectsData[Math.floor(Math.random() * suspectsData.length)];
          description = description.replace(/\[SUSPECT_NAME\]/g, randomSuspect.name);
          description = description.replace(/\[S\]/g, randomSuspect.name.charAt(0));
          const imagePath = index < 2 ? imageFiles[index] : null;

          return {
            ...item,
            description,
            imagePath,
          };
        });

        setEvidence(selected);
      } catch (error) {
        console.error("Error fetching evidence:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvidence();
  }, []);

  const handleSelectEvidence = (item, index) => {
    if (isSelectionMode && index < 2) {
      setSelectedEvidence(item);
    }
  };

  const handleDone = () => {
    if (isSelectionMode) {
      // Return to killer page with selected evidence
      navigate("/killer", { 
        state: { selectedEvidence } 
      });
    } else {
      // Normal view mode - go back
      navigate(-1);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="page evidence-page">
      <TopIcons />
      
      {isSelectionMode && (
        <div className="selection-header">
          <h2>Select Evidence for Your Accusation</h2>
        </div>
      )}

      <div className="evidence-grid">
        {evidence.map((item, index) => (
          <div 
            className={`evidence-card ${
              isSelectionMode && index < 2 ? "selectable" : ""
            } ${
              selectedEvidence === item ? "selected" : ""
            }`}
            key={index}
            onClick={() => handleSelectEvidence(item, index)}
          >
            <div className={`evidence-frame ${index >= 2 ? "locked-slot" : ""}`}>
              {index < 2 ? (
                <img src={item.imagePath} alt="Evidence" />
              ) : (
                <div className="locked-inner">
                  <span className="locked-icon">🔒</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="description-frame">
        {evidence.map((item, index) => (
          <div className="description-item" key={index}>
            {index < 2 ? (
              <p>{item.description}</p>
            ) : (
              <p className="locked-text">EVIDENCE LOCKED</p>
            )}
          </div>
        ))}
      </div>

      <button 
        className="done-button" 
        onClick={handleDone}
        disabled={isSelectionMode && !selectedEvidence}
      >
        {isSelectionMode ? "Confirm Selection" : "Done"}
      </button>
    </div>
  );
}
