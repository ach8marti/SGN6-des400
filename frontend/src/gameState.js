// src/gameState.js
const KEY = "detectiveGameState";

export function loadGame() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

export function saveGame(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function resetGame() {
  try {
    localStorage.removeItem(KEY);
    localStorage.removeItem("currentStory");
    
    // Clear chat data
    clearChatData();
  } catch (e) {
    console.error("Failed to reset game:", e);
  }
}

// Add helper function to clear only chat data
export function clearChatData() {
  localStorage.removeItem("chatMessages");
  localStorage.removeItem("chatPhase");
  localStorage.removeItem("chatLoadedPhases");
  localStorage.removeItem("chatReplies");
  localStorage.removeItem("chatNextPhase");
}

/* ---------- SUSPECTS ---------- */
export function lockSuspects(suspects) {
  const gs = loadGame();
  if (gs.suspects && gs.suspects.length > 0) return gs.suspects;
  gs.suspects = suspects.slice(0, 5);
  saveGame(gs);
  return gs.suspects;
}

export function getLockedSuspects() {
  const gs = loadGame();
  return gs.suspects || [];
}

/* ---------- EVIDENCE ---------- */
export function lockEvidenceAssignments(evidenceList) {
  const gs = loadGame();
  if (gs.evidenceAssignments && Object.keys(gs.evidenceAssignments).length > 0) {
    return gs.evidenceAssignments;
  }
  const suspects = gs.suspects || [];
  if (suspects.length === 0) return {};
  const map = {};
  evidenceList.forEach((ev) => {
    const rand = suspects[Math.floor(Math.random() * suspects.length)];
    map[ev.id] = rand.name;
  });
  gs.evidenceAssignments = map;
  saveGame(gs);
  return map;
}

export function addEvidenceUnlock(evidenceIds = []) {
  const gs = loadGame();
  const current = new Set(gs.unlockedEvidence || []);
  evidenceIds.forEach((id) => current.add(id));
  gs.unlockedEvidence = Array.from(current);
  saveGame(gs);
}

export function getUnlockedEvidence() {
  const gs = loadGame();
  return gs.unlockedEvidence || [];
}

export function getEvidenceForDisplay(evidenceList) {
  const gs = loadGame();
  const assignment = gs.evidenceAssignments || {};
  const unlockedSet = new Set(gs.unlockedEvidence || []);
  const suspects = gs.suspects || [];
  return evidenceList.slice(0, 4).map((ev) => {
    const suspectName =
      assignment[ev.id] || (suspects[0] ? suspects[0].name : "Unknown");
    return {
      ...ev,
      isUnlocked: unlockedSet.has(ev.id),
      description: ev.summaryTemplate
        ? ev.summaryTemplate.replace("[SUSPECT_NAME]", suspectName)
        : "",
      imagePath: `/pics/evidence/${ev.id}.png`,
    };
  });
}

/* ---------- INTERROGATION ---------- */
export function increaseInterrogation() {
  const gs = loadGame();
  gs.interrogationCount = (gs.interrogationCount || 0) + 1;
  saveGame(gs);
}

export function getInterrogationCount() {
  const gs = loadGame();
  return gs.interrogationCount || 0;
}

export function canInvestigateMore() {
  return getInterrogationCount() < 2;
}

/* ---------- CORRECT ANSWERS ---------- */
export function increaseCorrect() {
  const gs = loadGame();
  gs.correctAnswers = (gs.correctAnswers || 0) + 1;
  saveGame(gs);
}

export function getCorrectAnswers() {
  const gs = loadGame();
  return gs.correctAnswers || 0;
}