const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const avatarUpload = require('../middleware/avatarUpload');

// All routes in this file are protected by the auth middleware
router.use(authMiddleware);

router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.put('/profile-picture', avatarUpload, userController.updateProfilePicture);

module.exports = router;