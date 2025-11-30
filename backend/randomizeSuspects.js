// randomizeSuspects.js
const baseSuspects = require("./suspects.json");

// --------- ROLE LIST ---------

const ROLES = [
  "Friend",
  "Close Friend",
  "Colleague",
  "Boss",
  "Intern",
  "Neighbor",
  "Family Member",
  "Ex-partner",
  "Acquaintance",
  "Former Classmate",
  "Business Partner",
  "Stranger",
];

// --------- RELATIONS BY ROLE ---------

const RELATIONS_BY_ROLE = {
  "Close Friend": [
    "Grew up together and share many secrets.",
    "Trusted confidante who knows the victim's fears.",
    "Always by the victim's side during hard times.",
    "The one person the victim fully opened up to.",
  ],
  Friend: [
    "Casual hangout friend with shared hobbies.",
    "Got closer recently through shared experiences.",
    "Old friend who drifted apart over time.",
    "Supportive friend but sometimes overshadowed.",
  ],
  "Family Member": [
    "Lives in the same house as the victim.",
    "Feels responsible for protecting the victim.",
    "Had long-standing family tension with the victim.",
    "Often argued about family expectations.",
  ],
  Colleague: [
    "Works closely with the victim on key projects.",
    "Competes with the victim for recognition.",
    "Feels overlooked compared to the victim.",
    "Resents the praise the victim always received.",
  ],
  Boss: [
    "Had full control over the victim's career.",
    "Frequently criticized the victim's performance.",
    "Pressured the victim with impossible deadlines.",
  ],
  Intern: [
    "Looked up to the victim as a mentor.",
    "Felt ignored or underappreciated by the victim.",
    "Relied on the victim for guidance but felt abandoned.",
  ],
  Neighbor: [
    "Saw the victim’s routine every day.",
    "Heard frequent arguments from the victim’s home.",
    "Noticed unusual visitors coming and going.",
    "Often exchanged small talk with the victim.",
  ],
  "Ex-partner": [
    "Had a painful breakup with unresolved issues.",
    "Still emotionally attached to the victim.",
    "Blames the victim for ruining their life.",
    "Tried to reconnect but was rejected.",
  ],
  Acquaintance: [
    "Only met the victim at social gatherings.",
    "Knows the victim through mutual friends.",
    "Had a brief but intense disagreement once.",
  ],
  "Former Classmate": [
    "Shared classes but were never very close.",
    "Used to admire the victim’s talent from afar.",
    "Felt overshadowed by the victim during school.",
  ],
  "Business Partner": [
    "Co-founded a project with the victim.",
    "Argued over money and control of decisions.",
    "Felt betrayed over a business deal.",
  ],
  Stranger: [
    "Was seen arguing with the victim shortly before the incident.",
    "Has an unknown connection to the victim.",
    "Appeared in CCTV following the victim.",
  ],
};

const RELATIONS_DEFAULT = [
  "Had a distant but tense connection.",
  "Recently came back into the victim's life.",
  "Shared a complicated history with the victim.",
];

// --------- SUSPICIONS BY ROLE ---------

const SUSPICIONS_BY_ROLE = {
  "Close Friend": [
    "Jealous of how the victim prioritized others.",
    "Felt betrayed after a deep secret was exposed.",
    "Angry that the victim was pulling away from them.",
  ],
  Friend: [
    "Resented always being treated as a backup.",
    "Upset after being replaced by a new friend.",
    "Felt used by the victim for convenience.",
  ],
  "Family Member": [
    "Angry over how the victim treated another family member.",
    "Felt the victim ruined the family’s reputation.",
    "Vilified the victim after a dispute over inheritance.",
  ],
  Colleague: [
    "Believed the victim stole their idea at work.",
    "Lost a promotion because the victim outperformed them.",
    "Felt humiliated by the victim in front of coworkers.",
  ],
  Boss: [
    "Thought the victim was planning to expose their misconduct.",
    "Feared losing status due to the victim’s complaint.",
  ],
  Intern: [
    "Felt exploited and blamed the victim for unfair treatment.",
    "Believed the victim sabotaged their evaluation.",
  ],
  Neighbor: [
    "Annoyed by constant noise and late-night visitors.",
    "Suspected the victim of spying on them.",
    "Resented the victim over a property or parking dispute.",
  ],
  "Ex-partner": [
    "Couldn't accept the victim moving on with someone new.",
    "Blamed the victim for emotional and financial damage.",
    "Angry after being cut off completely by the victim.",
  ],
  Acquaintance: [
    "Held a grudge over a past humiliation.",
    "Felt insulted by something the victim said publicly.",
  ],
  "Former Classmate": [
    "Still jealous of the victim’s success after school.",
    "Felt the victim ruined their reputation years ago.",
  ],
  "Business Partner": [
    "Lost a large amount of money due to the victim.",
    "Felt cheated out of an important deal.",
  ],
  Stranger: [
    "Was blackmailed by the victim for unknown reasons.",
    "Had a hidden connection the victim discovered.",
  ],
};

const SUSPICIONS_DEFAULT = [
  "Financial desperation.",
  "Fear of being exposed.",
  "Revenge for a past betrayal.",
  "Unknown motives.",
];

// --------- TRUST & TRAITS ---------

const TRUST_STRINGS = ["★☆☆☆☆", "★★☆☆☆", "★★★☆☆", "★★★★☆", "★★★★★"];

const TRAITS_POOL = [
  "evasive",
  "nervous",
  "confident",
  "calm",
  "observant",
  "quiet",
  "supportive",
  "anxious",
  "friendly",
  "outgoing",
  "mysterious",
  "elusive",
  "loyal",
  "thoughtful",
  "protective",
  "caring",
  "secretive",
  "emotional",
  "moody",
  "calculating",
];

// role groups → trust tier
const HIGH_TRUST_ROLES = ["Close Friend", "Family Member"];
const MID_TRUST_ROLES = [
  "Friend",
  "Neighbor",
  "Colleague",
  "Business Partner",
  "Former Classmate",
  "Acquaintance",
];
const LOW_TRUST_ROLES = ["Stranger", "Ex-partner", "Boss", "Intern"];

// --------- HELPERS ---------

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickRandomTraits(count = 2) {
  const traits = [];
  const pool = [...TRAITS_POOL];

  for (let i = 0; i < count && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    traits.push(pool[idx]);
    pool.splice(idx, 1);
  }
  return traits;
}

// high → 4–5, mid → 2–4, low → 1–2
function getTrustScoreForRole(role) {
  if (HIGH_TRUST_ROLES.includes(role)) {
    const options = [4, 5, 4, 5];
    return pickRandom(options);
  }

  if (MID_TRUST_ROLES.includes(role)) {
    const options = [2, 3, 4, 3];
    return pickRandom(options);
  }

  if (LOW_TRUST_ROLES.includes(role)) {
    const options = [1, 2, 1, 2];
    return pickRandom(options);
  }

  return 3;
}

function getRelationForRole(role) {
  const list = RELATIONS_BY_ROLE[role] || RELATIONS_DEFAULT;
  return pickRandom(list);
}

function getSuspicionForRole(role) {
  const list = SUSPICIONS_BY_ROLE[role] || SUSPICIONS_DEFAULT;
  return pickRandom(list);
}

// --------- RANDOMIZE ALL SUSPECTS ---------

function getRandomizedSuspectsAll() {
  return baseSuspects.map((s) => {
    const role = pickRandom(ROLES);
    const trustScore = getTrustScoreForRole(role);
    const trust = TRUST_STRINGS[trustScore - 1];

    return {
      id: s.id,
      image: s.image,
      name: s.name,
      role,
      relation: getRelationForRole(role),
      trust,
      suspicion: getSuspicionForRole(role),
      traits: pickRandomTraits(2),
    };
  });
}

// --------- PICK GAME SET (ensure high/mid/low if possible) ---------

function getTrustTierFromRole(role) {
  if (HIGH_TRUST_ROLES.includes(role)) return "high";
  if (LOW_TRUST_ROLES.includes(role)) return "low";
  if (MID_TRUST_ROLES.includes(role)) return "mid";
  return "mid";
}

function getRandomizedSuspectsForGame(count = 5) {
  const all = getRandomizedSuspectsAll(); // 10 ตัว random ทั้งเซ็ต

  const high = [];
  const mid = [];
  const low = [];
  const others = [];

  all.forEach((s) => {
    const tier = getTrustTierFromRole(s.role);
    if (tier === "high") high.push(s);
    else if (tier === "mid") mid.push(s);
    else if (tier === "low") low.push(s);
    else others.push(s);
  });

  const selected = [];

  function takeOneFrom(arr) {
    if (!arr.length) return null;
    const idx = Math.floor(Math.random() * arr.length);
    const [item] = arr.splice(idx, 1);
    selected.push(item);
    return item;
  }

  // พยายามให้มี high / mid / low อย่างน้อยอย่างละ 1 ถ้ามี
  if (high.length) takeOneFrom(high);
  if (mid.length) takeOneFrom(mid);
  if (low.length) takeOneFrom(low);

  // รวม pool ที่เหลือทั้งหมด
  let pool = [...high, ...mid, ...low, ...others];

  // กันไม่ให้เลือกซ้ำตัวเดิม
  const usedIds = new Set(selected.map((s) => s.id));
  pool = pool.filter((s) => !usedIds.has(s.id));

  while (selected.length < count && pool.length > 0) {
    takeOneFrom(pool);
  }

  return selected;
}

module.exports = {
  getRandomizedSuspectsAll,
  getRandomizedSuspectsForGame,
};