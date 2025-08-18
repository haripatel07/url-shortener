// Description: Route to get analytics for a specific shortened URL
const express = require('express');
const auth = require('../middlewares/auth');
const Url = require('../models/Url');

const router = express.Router();

router.get('/:shortUrl', auth, async (req, res) => {
  try {
    const url = await Url.findOne({
      shortUrl: req.params.shortUrl,
      userId: req.user._id,
    });

    if (!url) {
      return res.status(404).json({ msg: 'URL not found or not owned by user' });
    }

    res.status(200).json({
      analytics: url.analytics, 
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
