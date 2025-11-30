const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const randomizeSuspects = require("./randomizeSuspects");

const app = express();
app.use(cors());
app.use(express.json());

function readJson(fileName) {
  const filePath = path.join(__dirname, fileName);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

app.get("/api/story", (req, res) => {
  try {
    const stories = readJson("stories.json");
    if (!Array.isArray(stories) || stories.length === 0) {
      return res.status(500).json({ error: "No stories available" });
    }

    const chosen = stories[Math.floor(Math.random() * stories.length)];
    return res.json(chosen);
  } catch (err) {
    console.error("Error in /api/story:", err);
    return res.status(500).json({ error: "Failed to load story file" });
  }
});

app.get("/api/suspects", (req, res) => {
  try {
    const storyType = req.query.type || "university";
    const suspects = readJson("suspects.json");
    if (!Array.isArray(suspects) || suspects.length === 0) {
      return res.status(500).json({ error: "No suspects available" });
    }

    const randomized = randomizeSuspects(suspects, storyType);
    return res.json(randomized);
  } catch (err) {
    console.error("Error in /api/suspects:", err);
    return res.status(500).json({ error: "Failed to load suspects" });
  }
});

app.get("/api/evidence", (req, res) => {
  try {
    const evidence = readJson("evidence.json");
    return res.json(evidence);
  } catch (err) {
    console.error("Error in /api/evidence:", err);
    return res.status(500).json({ error: "Failed to load evidence" });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});