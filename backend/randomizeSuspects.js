function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const rolePools = {
  university: [
    "Roommate",
    "Classmate",
    "Group Project Partner",
    "Dorm Neighbor",
    "Ex-Partner",
    "Club Member"
  ],
  office: [
    "Coworker",
    "Manager",
    "Team Lead",
    "Intern",
    "Client Representative"
  ],
  neighborhood: [
    "Next-door Neighbor",
    "Landlord",
    "Security Guard",
    "Shop Owner",
    "Dog Walker",
    "Committee Member"
  ]
};

const relationPools = {
  university: [
    "Close friend from the same major.",
    "Worked together on a difficult group project.",
    "Dorm neighbor who often borrowed things.",
    "Used to date but broke up badly.",
    "Often studied together late at night."
  ],
  office: [
    "Worked closely on an important project.",
    "Competed for the same promotion.",
    "Had tension over deadlines.",
    "Blamed each other for mistakes."
  ],
  neighborhood: [
    "Often argued about noise.",
    "Had a disagreement over parking.",
    "Frequently seen around the victim's house.",
    "Talked behind the victim's back in the Line group."
  ]
};

const suspicionPools = {
  university: [
    "Was the last person seen walking with the victim.",
    "Had a loud argument about grades recently.",
    "Knew the victim’s schedule very well.",
    "Acted strangely after the incident."
  ],
  office: [
    "Would benefit if the victim left the company.",
    "Had a heated discussion on the night of the incident.",
    "Was caught checking the victim’s desk after hours."
  ],
  neighborhood: [
    "Seen lurking near the victim's home last night.",
    "Had a financial dispute with the victim.",
    "Spread rumors in the neighborhood Line group.",
    "Seemed too interested in the victim’s routines."
  ]
};

function randomizeSuspects(baseSuspects, storyType) {
  const roles = rolePools[storyType] || rolePools.university;
  const relations = relationPools[storyType] || relationPools.university;
  const suspicions = suspicionPools[storyType] || suspicionPools.university;

  return baseSuspects.map((s) => ({
    ...s,
    role: randomPick(roles),
    relation: randomPick(relations),
    suspicion: randomPick(suspicions)
  }));
}

module.exports = randomizeSuspects;