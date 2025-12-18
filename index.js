import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

/* 🔑 PEGA AQUÍ A5A64AF0B0DF1AF51080E5180AB57401
 */
const STEAM_KEY = "TU_CLAVE_STEAM";

/* 🔴 PEGA AQUÍ 76561197977166533 */
const STEAM_ID = "TU_STEAM_ID";

app.get("/", (req, res) => {
  res.send("Gameflox backend OK");
});

app.get("/achievements/:appid", async (req, res) => {
  try {
    const appid = req.params.appid;

    const r = await fetch(
      `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${appid}&key=${STEAM_KEY}&steamid=${STEAM_ID}`
    );

    const j = await r.json();

    const ach = j.playerstats.achievements.map(a => ({
      name: a.apiname,
      achieved: a.achieved === 1
    }));

    res.json({ achievements: ach });
  } catch (e) {
    res.status(500).json({ error: "Steam error" });
  }
});

app.listen(PORT, () => {
  console.log("Gameflox backend running");
});
