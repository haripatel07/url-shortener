// Redirect route for short URLs
const express = require('express');
const Url = require('../models/Url');

const router = express.Router();

router.get('/:shortUrl', async (req, res) => {
  try {
    const { shortUrl } = req.params;
    const url = await Url.findOne({ shortUrl });

    if (url) {
      url.clicks++;
      await url.save();
      return res.redirect(url.originalUrl);
    } else {
      return res.status(404).json({ error: 'URL not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;