const cloudinary = require('../config/cloudinary'); // <-- Add this line
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const getProfile = async (req, res) => {
  try {
    // The user object is attached to the request by the authMiddleware.
    // There's no need to query the database again for this information.
    const { first_name, last_name, email, profile_picture_url } = req.user;

    // Return only non-sensitive information
    res.json({
      first_name,
      last_name,
      email,
      profile_picture_url,
    });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { first_name, last_name } = req.body;

    if (!first_name || !last_name) {
      return res.status(400).json({ error: 'First name and last name are required.' });
    }

    const updatedUser = await User.updateProfile(user_id, { first_name, last_name });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found or could not be updated.' });
    }

    // To ensure the UI updates immediately without a re-login,
    // we issue a new token with the updated user information.
    const token = jwt.sign({
        user_id: updatedUser.user_id,
        email: updatedUser.email,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        profile_picture_url: updatedUser.profile_picture_url
    }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser,
      token // Send back the new token
    });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded or file type is invalid.' });
    }

    // Upload the file to Cloudinary
    const result = await uploadToCloudinary(req.file);

    // The URL for the uploaded image
    const profilePictureUrl = result.secure_url; // Cloudinary URL

    // Update user profile with the new picture URL
    const updatedUser = await User.updateProfilePicture(req.user.user_id, profilePictureUrl);

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Generate a new token with updated user info
    const token = jwt.sign({
      user_id: updatedUser.user_id,
      email: updatedUser.email,
      first_name: updatedUser.first_name,
      last_name: updatedUser.last_name,
      profile_picture_url: updatedUser.profile_picture_url
    }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      message: 'Profile picture updated successfully',
      user: updatedUser,
      token
    });
  } catch (err) {
    console.error('Error updating profile picture:', err);

    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File is too large. Maximum size is 2MB.' });
      }
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' });
      }
      return res.status(400).json({ error: `File upload error: ${err.message}` });
    }

    res.status(500).json({ error: `Server error while updating picture: ${err.message}` });
  }
};

// Function to upload to Cloudinary using streams
const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto', // Auto-detect file type (image/video)
        folder: 'gradely_avatars', // Cloudinary folder to store the image
        public_id: 'avatar-' + file.originalname, // Public ID for the file
        transformation: [{ width: 250, height: 250, crop: 'fill', gravity: 'face' }], // Apply face detection transformation
      },
      (error, result) => {
        if (error) reject(error);
        resolve(result);
      }
    ).end(file.buffer); // Pass the file buffer directly
  });
};

module.exports = {
  getProfile,
  updateProfile,
  updateProfilePicture,
  uploadToCloudinary
};