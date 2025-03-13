const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel');
require('dotenv').config();

// Local Strategy
passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user || !user.password)
          return done(null, false, { message: 'Incorrect email or password' });
        const isMatch = await user.comparePassword(password);
        if (!isMatch)
          return done(null, false, { message: 'Incorrect email or password' });
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.CALLBACK_URL_FB,
      profileFields: ['id', 'emails', 'name'],
      version: 'v11.0',
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log('Facebook Profile:', profile);
      try {
        let user = await User.findOne({ facebookId: profile.id });
        if (!user) {
          const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
          user = new User({
            facebookId: profile.id,
            username: `fb_${profile.id}`, // Dùng ID nếu không có email
            email: email, // Có thể null
            name: `${profile.name.givenName} ${profile.name.familyName}`,
          });
          await user.save();
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = new User({
            googleId: profile.id,
            username: profile.emails[0].value,
            email: profile.emails[0].value,
            name: profile.displayName,
          });
          await user.save();
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

module.exports = passport;