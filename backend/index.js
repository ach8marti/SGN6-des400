// index.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const {
  getRandomizedSuspectsAll,
  getRandomizedSuspectsForGame,
} = require("./randomizeSuspects");

const app = express();
app.use(cors());
app.use(express.json());

// base JSON ดิบ
app.get("/api/suspects/raw", (req, res) => {
  res.sendFile(path.join(__dirname, "suspects.json"));
});

// random ทั้ง 10 คน (เอาไว้ debug ถ้าอยากดู)
app.get("/api/suspects/random-all", (req, res) => {
  const all = getRandomizedSuspectsAll();
  res.json(all);
});

// 👉 ใช้ในเกม: ส่งชุดที่คัดมาแล้ว (ธรรมดา 5 คน + พยายามมี high/mid/low ครบ)
app.get("/api/suspects", (req, res) => {
  const gameSuspects = getRandomizedSuspectsForGame(5);
  res.json(gameSuspects);
});

// evidence ดิบ
app.get("/api/evidence", (req, res) => {
  res.sendFile(path.join(__dirname, "evidence.json"));
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});