const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('../config/db'); // Make sure this path is correct

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback',
    scope: ['profile', 'email'] // Explicitly request profile and email
  },
  async (accessToken, refreshToken, profile, done) => {
    const { id, name, emails, photos } = profile;
    const email = emails && emails[0] ? emails[0].value : null;
    const firstName = name && name.givenName ? name.givenName : 'User';
    const lastName = name && name.familyName ? name.familyName : '';
    const avatarUrl = photos && photos[0] ? photos[0].value : null;

    if (!email) {
      return done(new Error("Could not retrieve email from Google profile."), null);
    }

    try {
      // 1. Check if a user already exists with this Google ID
      let userResult = await pool.query('SELECT * FROM users WHERE google_id = $1', [id]);

      if (userResult.rows.length > 0) {
        // User found, pass their DB record to the callback
        return done(null, userResult.rows[0]);
      }

      // 2. If not, check if an account exists with that email (to link accounts)
      userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

      if (userResult.rows.length > 0) {
        // User exists, but doesn't have google_id. Let's link them.
        const existingUser = userResult.rows[0];
        // Use COALESCE to avoid overwriting a custom avatar with the Google one
        const updatedUserResult = await pool.query(
          'UPDATE users SET google_id = $1, is_email_confirmed = true, avatar_url = COALESCE(avatar_url, $2) WHERE user_id = $3 RETURNING *',
          [id, avatarUrl, existingUser.user_id]
        );
        return done(null, updatedUserResult.rows[0]);
      }

      // 3. If no user exists at all, create a new one
      const newUserResult = await pool.query(
        `INSERT INTO users (first_name, last_name, email, google_id, is_email_confirmed, avatar_url, password_hash)
         VALUES ($1, $2, $3, $4, true, $5, $6)
         RETURNING *`,
        [firstName, lastName, email, id, avatarUrl, 'OAUTH_USER_NO_PASSWORD']
      );

      return done(null, newUserResult.rows[0]);

    } catch (err) {
      console.error("Error during Google OAuth strategy:", err);
      return done(err, null);
    }
  }
));

passport.serializeUser((user, done) => {
  // 'user' is our database record. We serialize the user_id into the session.
  done(null, user.user_id);
});

passport.deserializeUser(async (id, done) => {
  // We deserialize the user_id from the session to get the full user object.
  try {
    const result = await pool.query('SELECT * FROM users WHERE user_id = $1', [id]);
    if (result.rows.length > 0) {
      done(null, result.rows[0]);
    } else {
      done(new Error('User not found from session ID.'));
    }
  } catch (err) {
    done(err, null);
  }
});
