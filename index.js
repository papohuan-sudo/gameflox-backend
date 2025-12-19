const express = require("express");
const session = require("express-session");
const passport = require("passport");
const SteamStrategy = require("passport-steam").Strategy;

const app = express();
const PORT = process.env.PORT || 3000;

app.set("trust proxy", 1);


/* ─────────────────────
   SESIONES
───────────────────── */
app.use(
  session({
    secret: "gameflox_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      sameSite: "none",
    },
  })
);


/* ─────────────────────
   STEAM STRATEGY
───────────────────── */
passport.use(
  new SteamStrategy(
    {
      returnURL: "https://gameflox-backend.onrender.com/auth/steam/return",
      realm: "https://gameflox-backend.onrender.com",
      apiKey: process.env.STEAM_API_KEY,
    },
    (identifier, profile, done) => {
      // SteamID limpio
      profile.id = identifier.match(/\d+$/)[0];

      return done(null, profile);
    }
  )
);



/* ─────────────────────
   RUTAS
───────────────────── */
app.get("/", (req, res) => {
  res.send("Gameflox backend online 🚀");
});

app.get("/auth/steam", passport.authenticate("steam"));

app.get(
  "/auth/steam/return",
  passport.authenticate("steam", { failureRedirect: "/" }),
  (req, res) => {
    res.send(`
      <h1>Steam conectado correctamente 🎮</h1>
      <p>SteamID: ${req.user.id}</p>
    `);
  }
);

/* ─────────────────────
   JUEGOS DEL USUARIO
───────────────────── */
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

app.get("/games", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Not logged in" });
  }

  const steamId = req.user.id;

  const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${process.env.STEAM_API_KEY}&steamid=${steamId}&include_appinfo=true&include_played_free_games=true&format=json`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data.response.games || []);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch games" });
  }
});

/* ─────────────────────
   SERVER
───────────────────── */
app.listen(PORT, () => {
  console.log("Gameflox backend running on port " + PORT);
});
