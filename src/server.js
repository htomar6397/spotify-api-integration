const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const config = require('./config');
const routes = require('./routes');

// Initialize Express app
const app = express();

// Session configuration
const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' }
};

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(session(sessionConfig));

// Pretty print JSON responses
app.set('json spaces', 2);

// API routes
app.use('/spotify', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
const PORT = config.server.port;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Spotify auth URL: http://localhost:${PORT}/spotify/login`);
});

module.exports = app;
