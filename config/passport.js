const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/userModel');
require('dotenv').config();

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Local Strategy
passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user || !user.password) return done(null, false, { message: 'Incorrect email or password' });
      const isMatch = await user.comparePassword(password);
      if (!isMatch) return done(null, false, { message: 'Incorrect email or password' });
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// Facebook Strategy
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.CALLBACK_URL,
  profileFields: ['id', 'emails', 'name'],
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ facebookId: profile.id });
    if (user) return done(null, user);

    user = await User.findOne({ email: profile.emails[0].value });
    if (user) {
      user.facebookId = profile.id;
      await user.save();
      return done(null, user);
    }

    user = new User({
      userId: `CUST${Date.now()}`,
      username: profile.emails[0].value.split('@')[0],
      email: profile.emails[0].value,
      name: `${profile.name.givenName} ${profile.name.familyName}`,
      facebookId: profile.id,
    });
    await user.save();
    done(null, user);
  } catch (err) {
    done(err);
  }
}));

module.exports = passport;