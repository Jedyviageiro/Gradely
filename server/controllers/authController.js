const { User, EmailConfirmation, PasswordReset } = require('../models');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const fs = require('fs').promises;

const signup = async(req, res) => {
    try{
        const {email, password, first_name, last_name} = req.body;
        const existingUser = await User.findByEmail(email);
        if(existingUser){
            return res.status(400).json({error: 'User already exists'});
        }
        const user = await User.createUser({email, password, first_name, last_name});
        const token = crypto.randomBytes(20).toString('hex');
        await EmailConfirmation.createToken(user.user_id, token);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            })
        await transporter.sendMail({
            to: email,
            subject: 'Gradely Email Confirmation',
            text: `Please confirm your email: http://localhost:5173/confirm-email/${token}`,
        });
        
        res.status(201).json({ message: 'User created, confirmation email sent'});
    }
    catch (error){
        console.error("Signup error:", error);  // Log the error
        res.status(500).json({
            error: 'Server error'
        })
    }
}

 // Login
  const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findByEmail(email);
      if (!user || !(await User.verifyPassword(user, password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      if (!user.is_email_confirmed) {
        return res.status(403).json({ error: 'Email not confirmed' });
      }
      const token = jwt.sign({ user_id: user.user_id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
      
      // Create a user object to send to the client, excluding sensitive data
      const userForClient = {
        user_id: user.user_id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      };

      res.json({ token, user: userForClient });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ 
        error: 'Server error' });
    }
  }

  // Confirm email
  const confirmEmail = async (req, res) => {
    try {
      const { token } = req.params;
      const confirmation = await EmailConfirmation.findToken(token);
      if (!confirmation) {
        return res.status(400).json({ error: 'Invalid or expired token' });
      }
      await User.confirmEmail(confirmation.user_id);
      await EmailConfirmation.deleteToken(token);
      res.json({ message: 'Email confirmed successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  // Forgot password
  const forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const pin = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit PIN
      await PasswordReset.createPin(user.user_id, pin);

      // Send email with PIN
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      await transporter.sendMail({
        to: email,
        subject: 'Gradely Password Reset PIN',
        text: `Your password reset PIN is: ${pin}. It expires in 15 minutes.`,
      });

      res.json({ message: 'Password reset PIN sent to email' });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  // Reset password
  const resetPassword = async (req, res) => {
    try {
      const { pin, new_password } = req.body;
      const reset = await PasswordReset.findPin(pin);
      if (!reset) {
        return res.status(400).json({ error: 'Invalid or expired PIN' });
      }
      await User.updatePassword(reset.user_id, new_password);
      await PasswordReset.deletePin(pin);
      res.json({ message: 'Password reset successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  module.exports = {
    signup,
    login,
    confirmEmail,
    forgotPassword,
    resetPassword,
};