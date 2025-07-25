const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models'); // Adjust the path to your models if needed
require('dotenv').config();

module.exports = function(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback', // This should match the route in allRoutes.js
        proxy: true,
      },
      async (accessToken, refreshToken, profile, done) => {
        // This function is called on every Google login.
        const { id, name, emails, photos } = profile;
        const email = emails && emails.length > 0 ? emails[0].value : null;

        if (!email) {
          return done(new Error('No email found in Google profile.'), null);
        }

        try {
          // 1. Check if the user already exists in your database
          const existingUser = await User.findByEmail(email);

          if (existingUser) {
            // 2. If user exists, DO NOT update them with Google's data.
            // This preserves their custom profile picture and other settings.
            // Simply return the existing user to log them in.
            return done(null, existingUser);
          } else {
            // 3. If user does NOT exist, create a new one.
            const newUser = {
              google_id: id,
              email: email,
              first_name: name.givenName || 'User',
              last_name: name.familyName || '',
              // Only use Google's avatar for brand new users.
              profile_picture_url: photos && photos.length > 0 ? photos[0].value : null,
              is_verified: true, // Accounts from Google are pre-verified.
            };

            const createdUser = await User.create(newUser);
            return done(null, createdUser);
          }
        } catch (err) {
          console.error('Error in Google passport strategy:', err);
          return done(err, null);
        }
      }
    )
  );
};