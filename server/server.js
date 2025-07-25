// Load environment variables from .env file at the very beginning
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
require('./auth/googleStrategy'); // Load Google OAuth config
const routes = require('./routes/allRoutes');

const app = express();

// CORS config
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true, // 👈 Important: allow cookies for session
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Session middleware (must be before passport)
app.use(session({
  secret: 'your-secret',
  resave: false,
  saveUninitialized: false
}));

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
