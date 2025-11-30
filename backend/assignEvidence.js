// assignEvidence.js
const suspects = require("./suspects.json");
const evidences = require("./evidence.json");

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function applyFilters(suspect, filters = []) {
  return filters.every((f) => {
    const [key, value] = f.split("=");
    if (value === "true" || value === "false") {
      return Boolean(suspect[key]) === (value === "true");
    }
    return String(suspect[key]) === value;
  });
}

function fillSummaryTemplate(evidence, suspect) {
  let text = evidence.summaryTemplate.replace("[SUSPECT_NAME]", suspect.name);

  if (evidence.possibleMotives && evidence.possibleMotives.length > 0) {
    const motive = pickRandom(evidence.possibleMotives);
    text = text.replace("{motive_details}", motive);
  }

  if (evidence.possibleTraits && evidence.possibleTraits.length > 0) {
    const trait = pickRandom(evidence.possibleTraits);
    text = text
      .replace("{character_trait}", trait)
      .replace("{psychological_trait}", trait)
      .replace("{work_behavior}", trait);
  }

  return text;
}

// ฟังก์ชันหลัก: เรียกเมื่ออยาก "สุ่มเคสใหม่"
function generateEvidenceAssignments() {
  const resultBySuspect = {};
  suspects.forEach((s) => {
    resultBySuspect[s.id] = [];
  });

  evidences.forEach((ev) => {
    const { targetCount, filters = [], exclusive } = ev.assignment;
    const eligible = suspects.filter((s) => applyFilters(s, filters));
    if (eligible.length === 0) return;

    const maxTargets = Math.min(targetCount, eligible.length);
    let pool = [...eligible];

    for (let i = 0; i < maxTargets; i++) {
      if (pool.length === 0) break;

      const idx = Math.floor(Math.random() * pool.length);
      const suspect = pool[idx];

      const summary = fillSummaryTemplate(ev, suspect);

      resultBySuspect[suspect.id].push({
        id: ev.id,
        title: ev.title,
        slotType: ev.slotType,
        type: ev.type,
        revealedWhen: ev.revealedWhen,
        summary,
      });

      if (exclusive) {
        pool.splice(idx, 1);
      }
    }
  });

  return resultBySuspect;
}

module.exports = { generateEvidenceAssignments };