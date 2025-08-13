// This file defines the URL schema for the URL shortening service using Mongoose.
const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
    unique: true,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  expiresAt: {
    type: Date,
    default: null,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
  },
  analytics: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model('Url', urlSchema);