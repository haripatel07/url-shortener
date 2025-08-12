// Description: URL shortening service route
const express = require('express');
const { nanoid } = require('nanoid');
const Url = require('../models/Url');

const router = express.Router();

router.post('/shorten', async (req, res) => {
    const { originalUrl } = req.body;
    if (!originalUrl){
        return res.status(400).json({ error : 'Original URL is required' });
    }

    try{
        let url = await Url.findOne({ originalUrl});
        if (url){
            return res.json(url);
        }

        const shortUrl = nanoid(8);
        url = new Url({
            originalUrl,
            shortUrl,
        });
        await url.save();
        res.json(url);
    }catch(err){
        res.status(500).json({ error: 'Server error' });

    }
});

module.exports = router;