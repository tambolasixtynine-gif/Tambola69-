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
