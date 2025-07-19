const express = require('express');
const cors = require('cors');
const routes = require('./routes/allRoutes');
require('dotenv').config();

const app = express();

// Configure CORS to allow requests only from your frontend client
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));

app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));