const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// default route
app.get("/api/suspects", (req, res) => {
  res.sendFile(path.join(__dirname, "suspects.json"));
});


app.get("/api/evidence", (req, res) => {
  res.sendFile(path.join(__dirname, "evidence.json"));
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});