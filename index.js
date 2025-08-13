// This is the final entry point for the URL shortener application
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./db');

// Route files
const authRoutes = require('./routes/auth');
const urlRoutes = require('./routes/url');
const analyticsRoutes = require('./routes/analytics');
const redirectRoutes = require('./routes/redirect');

dotenv.config();

const app = express();

// Connect to the database
connectDB();

app.use(express.json());

// get the public directory for static files
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
const API_PREFIX = '/api/v1';

// Use the routes with a common API prefix
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/url`, urlRoutes);
app.use(`${API_PREFIX}/analytics`, analyticsRoutes);


app.use('/', redirectRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});