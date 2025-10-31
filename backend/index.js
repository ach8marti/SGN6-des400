const express = require("express");
const cors = require("cors");
const { db } = require("./firebaseAdmin");

const app = express();
app.use(cors());
app.use(express.json());

// default route
app.get("/", (req, res) => {
  res.send("Welcome to The Last Message Backend");
});

app.get("/api/suspects", async (req, res) => {
  try {
    const charactersSnapshot = await db.collection("suspects").get();
    const characters = [];
    charactersSnapshot.forEach(doc => {
      characters.push({ id: doc.id, ...doc.data() });
    });
    res.json(characters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});