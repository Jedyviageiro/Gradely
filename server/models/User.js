const pool = require('../config/db');
const bcrypt = require('bcrypt');

const createUser = async({ email, password, first_name, last_name }) => {
    try {
        const password_hash = await bcrypt.hash(password, 10); 
        const result = await pool.query(
            'INSERT INTO users (email, password_hash, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING *',
            [email, password_hash, first_name, last_name]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Failed to create user account');
    }
};

const findByEmail = async(email) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    } catch (error) {
        console.error('Error finding user by email:', error);
        throw new Error('Failed to retrieve user');
    }
};

const verifyPassword = async(user, password) => {
    try {
        return await bcrypt.compare(password, user.password_hash);
    } catch (error) {
        console.error('Error verifying password:', error);
        throw new Error('Failed to verify password');
    }
};

const updatePassword = async(user_id, new_password) => {
    try {
        const password_hash = await bcrypt.hash(new_password, 10);
        const result = await pool.query(
            'UPDATE users SET password_hash = $1 WHERE user_id = $2 RETURNING *',
            [password_hash, user_id]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error updating password:', error);
        throw new Error('Failed to update password');
    }
};

const confirmEmail = async(user_id) => {
    try {
        const result = await pool.query(
            'UPDATE users SET is_email_confirmed = true WHERE user_id = $1 RETURNING *',
            [user_id]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error confirming email:', error);
        throw new Error('Failed to confirm email');
    }
};

const updateProfilePicture = async(userId, profilePictureUrl) => {
  try {
    const result = await pool.query(
      'UPDATE users SET profile_picture_url = $1 WHERE user_id = $2 RETURNING user_id, email, first_name, last_name, profile_picture_url, is_email_confirmed',
      [profilePictureUrl, userId]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Error updating profile picture:', error);
    throw error;
  }
}

const updateProfile = async (userId, { first_name, last_name }) => {
  try {
    const result = await pool.query(
      'UPDATE users SET first_name = $1, last_name = $2 WHERE user_id = $3 RETURNING user_id, email, first_name, last_name, profile_picture_url, is_email_confirmed',
      [first_name, last_name, userId]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

module.exports = {
    createUser,
    findByEmail,
    verifyPassword,
    updatePassword,
    confirmEmail,
    updateProfile,
    updateProfilePicture,
};