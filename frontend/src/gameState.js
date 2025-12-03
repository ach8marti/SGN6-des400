// src/gameState.js
const KEY = "detectiveGameState";

// ----------------------------------------------------------
// Load / Save
// ----------------------------------------------------------
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

// ----------------------------------------------------------
// Suspects – lock 5 คนแรกเพียงครั้งเดียว
// ----------------------------------------------------------
export function lockSuspects(suspects) {
  const gs = loadGame();

  if (gs.suspects && gs.suspects.length === 5) {
    return gs.suspects; // already locked
  }

  gs.suspects = suspects.slice(0, 5);
  saveGame(gs);
  return gs.suspects;
}

export function getLockedSuspects() {
  const gs = loadGame();
  return gs.suspects || null;
}

// ----------------------------------------------------------
// Evidence – assign ให้ผู้ต้องสงสัยแบบสุ่ม 1 ครั้ง
// ----------------------------------------------------------
export function lockEvidenceAssignments(evidenceList) {
  const gs = loadGame();
  if (gs.evidenceAssignments) return gs.evidenceAssignments;

  const suspects = gs.suspects || [];
  const map = {};

  evidenceList.forEach((ev) => {
    const rand = suspects[Math.floor(Math.random() * suspects.length)];
    map[ev.id] = rand.name;
  });

  gs.evidenceAssignments = map;
  saveGame(gs);
  return map;
}

export function getEvidenceForDisplay(evidenceList) {
  const gs = loadGame();
  const assign = gs.evidenceAssignments || {};

  return evidenceList.slice(0, 4).map((ev, idx) => ({
    ...ev,
    isUnlocked: idx < 2,
    description: ev.summaryTemplate?.replace("[SUSPECT_NAME]", assign[ev.id]),
    imagePath: idx < 2 ? `/pics/evidence/${ev.id}.png` : null,
  }));
}

// ----------------------------------------------------------
// Investigation Count (max 2 times)
// ----------------------------------------------------------
export function increaseInterrogation() {
  const gs = loadGame();
  gs.interrogationCount = (gs.interrogationCount || 0) + 1;
  saveGame(gs);
}

export function canInvestigateMore() {
  const gs = loadGame();
  return (gs.interrogationCount || 0) < 2;
}

// ----------------------------------------------------------
// Correct Choices (need 4 to unlock accuse button)
// ----------------------------------------------------------
export function increaseCorrect() {
  const gs = loadGame();
  gs.correctAnswers = (gs.correctAnswers || 0) + 1;
  saveGame(gs);
}

export function canAccuse() {
  const gs = loadGame();
  return (
    (gs.correctAnswers || 0) >= 4 &&
    (gs.interrogationCount || 0) >= 2
  );
}