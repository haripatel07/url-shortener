// This is the entry point for the URL shortener application
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./db');
const urlRoutes = require('./routes/url');
const redirectRoutes = require('./routes/redirect');

dotenv.config();

const app = express();
connectDB();

app.use(express.json());

const PORT = process.env.PORT || 3000;

// Use the routes
app.use('/api', urlRoutes);
app.use('/', redirectRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});