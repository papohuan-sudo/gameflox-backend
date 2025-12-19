const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Gameflox backend online 🚀");
});

app.listen(PORT, () => {
  console.log("Gameflox backend running on port " + PORT);
});
