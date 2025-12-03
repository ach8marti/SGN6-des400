// index.js (backend)
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const randomizeSuspects = require("./randomizeSuspects");

const app = express();
app.use(cors());
app.use(express.json());

// ------------------------------------------------------------
// Helper: safely read JSON file in backend folder
// ------------------------------------------------------------
function readJson(fileName) {
  const filePath = path.join(__dirname, fileName);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

// ------------------------------------------------------------
// GET /api/story
// ------------------------------------------------------------

app.get("/api/story", (req, res) => {
  try {
    const stories = readJson("stories.json");

    if (!Array.isArray(stories) || stories.length === 0) {
      return res.status(500).json({ error: "No stories available" });
    }

    const randomIndex = Math.floor(Math.random() * stories.length);
    const baseStory = stories[randomIndex];

    const idMapByIndex = ["uni_group", "office_group", "village_line"];
    const storyId =
      baseStory.id || baseStory.storyId || idMapByIndex[randomIndex] || "uni_group";

    const story = {
      ...baseStory,
      id: storyId,
    };

    const passcodes = story.passcode || [];
    const hints = story.passcodeHintParagraph || [];
    const pairCount = Math.min(passcodes.length, hints.length);

    if (pairCount === 0) {
      return res.json({
        ...story,
        selectedPasscode: null,
        selectedPasscodeHintParagraph: null,
        selectedPasscodeIndex: null,
      });
    }

    const idx = Math.floor(Math.random() * pairCount);

    const responsePayload = {
      ...story,
      selectedPasscode: passcodes[idx],
      selectedPasscodeHintParagraph: hints[idx],
      selectedPasscodeIndex: idx,
    };

    return res.json(responsePayload);
  } catch (err) {
    console.error("Error in /api/story:", err);
    return res.status(500).json({ error: "Failed to load story file" });
  }
});
// ------------------------------------------------------------
// FIXED: GET /api/chat 
// (works with chatScripts.json in object format)
// ------------------------------------------------------------
app.get("/api/chat", (req, res) => {
  try {
    const { storyId, phase } = req.query;

    if (!storyId) {
      return res.status(400).json({ error: "Missing storyId query parameter" });
    }

    const phaseNumber = parseInt(phase || "1", 10);

    const scripts = readJson("chatScripts.json");

    // chatScripts.json must be an object (not array)
    if (!scripts || typeof scripts !== "object") {
      return res.status(500).json({ error: "Chat script file invalid format" });
    }

    // e.g. scripts["uni_group"]
    const storyBlock = scripts[storyId];
    if (!storyBlock) {
      return res.status(404).json({ error: `No chat script for storyId=${storyId}` });
    }

    // e.g. storyBlock["1"]
    const phaseBlock = storyBlock[String(phaseNumber)];
    if (!phaseBlock) {
      return res.status(404).json({
        error: `No chat script for storyId=${storyId}, phase=${phaseNumber}`
      });
    }

    return res.json({
      storyId,
      phase: phaseNumber,
      messages: phaseBlock.messages || [],
      choices: phaseBlock.choices || [],
      nextPhase: phaseBlock.nextPhase ?? null
    });

  } catch (err) {
    console.error("Error in /api/chat:", err);
    return res.status(500).json({ error: "Failed to load chat script" });
  }
});

// ------------------------------------------------------------
// GET /api/suspects
// ------------------------------------------------------------
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

// ------------------------------------------------------------
// GET /api/evidence
// ------------------------------------------------------------
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