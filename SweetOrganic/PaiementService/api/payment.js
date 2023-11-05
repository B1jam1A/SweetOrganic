//const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const express = require('express');
const router = express.Router();

router.get('/', async(req, res) =>{
    const public_key = process.env.STRIPE_PUBLIC_KEY;
    res.render('index', public_key);
});



module.exports = router;