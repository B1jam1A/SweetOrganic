const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const express = require('express');
const router = express.Router();
var app = express();
/*
const charge = await stripe.charges.create({
  amount: 2000, // amount in cents
  currency: 'usd',
  source: 'tok_visa', // token obtained with Stripe.js
  description: 'Charge for test@example.com',
});*/

app.post('/charge', async (req, res) =>{
    const {amount, token} = req.body;

    try{
        const charge = await stripe.charges.create({
            amount,
            currency: 'usd',
            source: token.id,
            description: 'Charge for test@example.com',
        });

        res.send('Payment successful');
    } catch (err) {
        console.error('Error processing payment:', err);
        let message = 'An error occured while processing your payment.';
        
        if(err.type === 'StripeCardError'){
            message = err.message;
        }
        res.status(500).send(message);
    }
});