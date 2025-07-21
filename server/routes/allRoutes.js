const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const essayController = require('../controllers/essayController');
const feedbackController = require('../controllers/feedbackController');
const authMiddleware = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');

// Auth Routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/confirm-email/:token', authController.confirmEmail);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);


// Essay Routes (protected)
router.post('/essays', authMiddleware, uploadMiddleware, essayController.uploadEssay);
router.get('/essays', authMiddleware, essayController.getUserEssays);
router.get('/essays/:essay_id', authMiddleware, essayController.getEssayById);
router.delete('/essays/:essay_id', authMiddleware, essayController.deleteEssay);
router.patch('/essays/:essay_id', authMiddleware, essayController.updateEssayTitle);

router.post('/essays/write', authMiddleware, essayController.createEssayFromText);
router.post('/essays/suggest', authMiddleware, essayController.getSuggestions);

// Feedback Routes (protected)
router.post('/essays/:essay_id/feedback', authMiddleware, feedbackController.generateFeedback);
router.get('/essays/:essay_id/feedback', authMiddleware, feedbackController.getEssayFeedback);
router.get('/feedback', authMiddleware, feedbackController.getUserFeedback);

module.exports = router;