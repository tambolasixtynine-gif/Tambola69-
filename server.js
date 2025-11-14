import express from "express";
import passport from "passport";
import dotenv from "dotenv";
import { Strategy as FacebookStrategy } from "passport-facebook";

dotenv.config();
const app = express();

// Passport Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ["id", "displayName", "emails"],
    },
    function (accessToken, refreshToken, profile, done) {
      // Here you can save or find the user in your database
      return done(null, profile);
    }
  )
);

app.use(passport.initialize());

// Facebook Login Routes
app.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/" }),
  (req, res) => {
    res.send(`🎉 Welcome to Tambola69, ${req.user.displayName}!`);
  }
);

app.listen(5000, () => console.log("Tambola69 server running at http://localhost:5000"));
// server.js
const express = require("express");
const app = express();
const path = require("path");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // frontend serve करेगा

// प्राइज़ डेटा
const prizes = [
  { id: 1, amount: 1000, isClaimed: false },
  { id: 2, amount: 1000, isClaimed: false },
  { id: 3, amount: 1000, isClaimed: false },
  { id: 4, amount: 1000, isClaimed: false },
  { id: 5, amount: 1000, isClaimed: false },
  { id: 6, amount: 5000, isClaimed: false },
];

// सभी प्राइज़ की स्थिति लौटाएँ
function getPrizesStatus() {
  return prizes;
}

// प्राइज़ क्लेम करें
function claimPrize(prizeId) {
  const prize = prizes.find((p) => p.id === prizeId);
  if (prize && !prize.isClaimed) {
    prize.isClaimed = true;
    return true;
  }
  return false;
}

// सभी प्राइज़ रीसेट करें (नई टिकट पर)
function resetPrizes() {
  prizes.forEach((p) => (p.isClaimed = false));
}

// 🎟️ नई टिकट बनाना
app.post("/api/tickets/generate", (req, res) => {
  resetPrizes();
  res.json({
    message: "New ticket generated successfully!",
    ticketId: Math.random().toString(36).substring(2, 8),
    prizes: getPrizesStatus(),
  });
});

// 💰 प्राइज़ की स्थिति प्राप्त करें
app.get("/api/prizes/status", (req, res) => {
  res.json(getPrizesStatus());
});

// 🏆 प्राइज़ क्लेम करें
app.post("/api/prize/claim/:id", (req, res) => {
  const success = claimPrize(parseInt(req.params.id));
  res.json({
    success,
    prizes: getPrizesStatus(),
  });
});

// सर्वर स्टार्ट करें
app.listen(3000, () => console.log("✅ Server running on http://localhost:3000"));
