// Load environment variables from .env file at the very beginning
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const passport = require('passport');
require('./config/passport')(passport); // Load Passport configuration
const routes = require('./routes/allRoutes');

const app = express();

// CORS config
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true, // 👈 Important: allow cookies for session
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Passport initialization for stateless JWT authentication.
// We don't use passport.session() because we are using tokens, not sessions.
app.use(passport.initialize());

app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
