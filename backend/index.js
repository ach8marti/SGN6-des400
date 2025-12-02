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
// Helper: read and parse a JSON file from the backend folder
// ------------------------------------------------------------
function readJson(fileName) {
  const filePath = path.join(__dirname, fileName);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

// ------------------------------------------------------------
// GET /api/story
// - Randomly selects one story from stories.json
// - Also selects ONE matching pair of passcode + hint paragraph
//   using the same random index, so they always stay in sync.
// ------------------------------------------------------------
app.get("/api/story", (req, res) => {
  try {
    const stories = readJson("stories.json");

    if (!Array.isArray(stories) || stories.length === 0) {
      return res.status(500).json({ error: "No stories available" });
    }

    // 1) Randomly choose one story
    const story = stories[Math.floor(Math.random() * stories.length)];

    // 2) Ensure both arrays exist and have at least one item
    const passcodes = story.passcode || [];
    const hints = story.passcodeHintParagraph || [];
    const pairCount = Math.min(passcodes.length, hints.length);

    if (pairCount === 0) {
      // Fallback: no valid pair, but still return the story
      return res.json({
        ...story,
        selectedPasscode: null,
        selectedPasscodeHintParagraph: null,
        selectedPasscodeIndex: null
      });
    }

    // 3) Pick a random index that exists in BOTH arrays
    const idx = Math.floor(Math.random() * pairCount);

    const responsePayload = {
      ...story,
      selectedPasscode: passcodes[idx],
      selectedPasscodeHintParagraph: hints[idx],
      selectedPasscodeIndex: idx
    };

    return res.json(responsePayload);
  } catch (err) {
    console.error("Error in /api/story:", err);
    return res.status(500).json({ error: "Failed to load story file" });
  }
});

// ------------------------------------------------------------
// GET /api/chat
// - Returns chat script (messages + choices) for a given story + phase.
//   Query params:
//     storyId = "uni_group" | "office_group" | "village_line"
//     phase   = integer (e.g. 1, 2)
// ------------------------------------------------------------
app.get("/api/chat", (req, res) => {
  try {
    const { storyId, phase } = req.query;

    if (!storyId) {
      return res.status(400).json({ error: "Missing storyId query parameter" });
    }

    const phaseNumber = parseInt(phase || "1", 10);

    const scripts = readJson("chatScripts.json");
    if (!Array.isArray(scripts) || scripts.length === 0) {
      return res.status(500).json({ error: "No chat scripts available" });
    }

    // Find chat script for this story
    const script = scripts.find((s) => s.storyId === storyId);
    if (!script) {
      return res.status(404).json({ error: `No chat script for storyId=${storyId}` });
    }

    // Find the phase block
    const phaseBlock = script.phases.find((p) => p.phase === phaseNumber);
    if (!phaseBlock) {
      return res.status(404).json({
        error: `No chat phase=${phaseNumber} for storyId=${storyId}`
      });
    }

    // Return only what the frontend needs
    return res.json({
      storyId,
      phase: phaseNumber,
      messages: phaseBlock.messages || [],
      choices: phaseBlock.choices || []
    });
  } catch (err) {
    console.error("Error in /api/chat:", err);
    return res.status(500).json({ error: "Failed to load chat script" });
  }
});

// ------------------------------------------------------------
// GET /api/suspects
// - Randomizes role / relation / suspicion based on story type
//   (currently stateless: called each time it will randomize.
//    Later, we will lock this via a game-state system.)
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
// - Returns all evidence definitions from evidence.json
//   (later we will lock/unlock per game phase)
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