// Redirect route for short URLs
const express = require('express');
const Url = require('../models/Url');
const geoip = require('geoip-lite');
const redisClient = require('../redisClient');

const router = express.Router();

router.get('/:shortUrl', async (req, res) => {
  const { shortUrl } = req.params;
  
  try {
    const cachedUrl = await redisClient.get(shortUrl);
    if (cachedUrl) {
      const url = JSON.parse(cachedUrl);
      
      if (url.expiresAt && new Date() > new Date(url.expiresAt)) {
        await redisClient.del(shortUrl);
        await Url.deleteOne({ shortUrl });
        return res.status(410).json({ error: 'URL has expired' });
      }
      
      Url.findOne({ shortUrl }).then(dbUrl => {
        if (dbUrl) {
          const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
          const geo = geoip.lookup(ip);
          const referrer = req.headers.referer || 'direct';

          dbUrl.clicks++;
          dbUrl.analytics.push({
            timestamp: new Date(),
            ipAddress: ip,
            country: geo ? geo.country : 'Unknown',
            referrer: referrer,
          });
          dbUrl.save();
        }
      });

      return res.redirect(url.originalUrl);
    }
    
    const url = await Url.findOne({ shortUrl });

    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    if (url.expiresAt && new Date() > url.expiresAt) {
      await url.deleteOne();
      await redisClient.del(shortUrl);
      return res.status(410).json({ error: 'URL has expired' });
    }
    
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const geo = geoip.lookup(ip);
    const referrer = req.headers.referer || 'direct';

    url.clicks++;
    url.analytics.push({
      timestamp: new Date(),
      ipAddress: ip,
      country: geo ? geo.country : 'Unknown',
      referrer: referrer,
    });
    
    await url.save();
    await redisClient.set(shortUrl, JSON.stringify(url), {
      EX: 3600,
    });
    
    return res.redirect(url.originalUrl);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;