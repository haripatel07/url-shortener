// Description: Route to get analytics for a specific shortened URL
const express = require('express');
const auth = require('../middleware/auth');
const Url = require('../models/Url');

const router = express.Router();

router.get('/analytics/:shortUrl', auth, async (req, res) => {
  try {
    const url = await Url.findOne({ shortUrl: req.params.shortUrl, userId: req.user.id });

    if (!url) {
      return res.status(404).json({ msg: 'URL not found or not owned by user' });
    }

    res.json(url.analytics);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;