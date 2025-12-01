import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Evidence.css";
import TopIcons from "../Phone/TopIcons.jsx";

export default function Evidence() {
  const navigate = useNavigate();
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const flag =
      typeof window !== "undefined" &&
      localStorage.getItem("evidenceUnlocked") === "true";
    setUnlocked(flag);
  }, []);

  useEffect(() => {
    const fetchEvidence = async () => {
      try {
        const [evidenceResponse, suspectsResponse] = await Promise.all([
          fetch("http://localhost:3001/api/evidence"),
          fetch("http://localhost:3001/api/suspects"),
        ]);

        const evidenceData = await evidenceResponse.json();
        const suspectsData = await suspectsResponse.json();

        // Shuffle evidence
        const shuffled = [...evidenceData];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        // 🔹 image files for the first 2 unlocked slots
        const imageFiles = [
          "/pics/evidence/e1.png",
          "/pics/evidence/e2.png", // <- change this if your second file has another name
        ];

        // Take 4 pieces total
        const selected = shuffled.slice(0, 4).map((item, index) => {
          let description = item.summaryTemplate;

          // Pick a random suspect
          const randomSuspect =
            suspectsData[Math.floor(Math.random() * suspectsData.length)];

          // Replace [SUSPECT_NAME]
          description = description.replace(
            /\[SUSPECT_NAME\]/g,
            randomSuspect.name
          );

          // Replace [S] with first letter
          description = description.replace(
            /\[S\]/g,
            randomSuspect.name.charAt(0)
          );

          // 🔹 Assign image: first two items get e1/e2, others don't need it
          const imagePath =
            index < 2 ? imageFiles[index] : null; // locked ones don't need an image

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

  const handleDone = () => {
    navigate("/messages");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="page evidence-page">
      <TopIcons />

      <div className="evidence-grid">
        {evidence.map((item, index) => (
          <div className="evidence-card" key={index}>
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

      <button className="done-button" onClick={handleDone}>
        Done
      </button>
    </div>
  );
}
