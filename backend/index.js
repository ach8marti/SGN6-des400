const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// default route
app.get("/", (req, res) => {
  res.send("Welcome to The Last Message Backend API");
});

// test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
