const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const essayController = require('../controllers/essayController');
const feedbackController = require('../controllers/feedbackController');
const userRoutes = require('./userRoutes');
const authMiddleware = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');
const passport = require('passport');
const jwt = require('jsonwebtoken');

// Auth Routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/confirm-email/:token', authController.confirmEmail);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Google Auth Routes
// This route starts the Google authentication flow
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// This is the callback route that Google will redirect to after authentication.
router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    // On failure, redirect back to the login page with an error query param
    failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=google-auth-failed`,
    session: false, // We are using JWTs, so we don't need sessions
  }),
  (req, res) => {
    // `req.user` is populated by Passport's `done` callback in the strategy.
    // It contains the user record from our database.
    const user = req.user;

    // Create a JWT payload. Match the payload from your regular login.
    const payload = {
      user_id: user.user_id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      profile_picture_url: user.profile_picture_url, // Standardize key to match the rest of the app
    };

    // Sign the token
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Redirect the user to a dedicated frontend route to handle the token.
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/auth/callback?token=${token}`);
  }
);

// User Profile Routes (protected by middleware inside userRoutes)
router.use('/user', userRoutes);

// Essay Routes (protected)
router.post('/essays', authMiddleware, uploadMiddleware, essayController.uploadEssay);
router.get('/essays', authMiddleware, essayController.getUserEssays);
router.get('/essays/:essay_id', authMiddleware, essayController.getEssayById);
router.delete('/essays/:essay_id', authMiddleware, essayController.deleteEssay);
router.patch('/essays/:essay_id', authMiddleware, essayController.updateEssayTitle);

router.post('/essays/write', authMiddleware, essayController.createEssayFromText);
router.post('/essays/suggest', authMiddleware, essayController.getSuggestions);
router.post('/essays/:essay_id/chat', authMiddleware, essayController.chatWithEssay);

// Feedback Routes (protected)
router.post('/essays/:essay_id/feedback', authMiddleware, feedbackController.generateFeedback);
router.get('/essays/:essay_id/feedback', authMiddleware, feedbackController.getEssayFeedback);
router.get('/feedback', authMiddleware, feedbackController.getUserFeedback);

router.post('/essays/correct-grammar', authMiddleware, essayController.correctGrammar);

module.exports = router;