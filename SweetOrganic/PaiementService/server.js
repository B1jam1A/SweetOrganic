//Get the packages we need
var express = require('express');
var bodyParser = require('body-parser');

const dotenv = require('dotenv');
dotenv.config();

//Library Stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
 
//Create our Express application
var app = express(); 

//Use environment defined port or 4242
var port = process.nextTick.PORT || 4242;
const DOMAIN = 'http://localhost:'+port;


app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

// Utiliser EJS comme moteur de rendu
app.set('view engine', 'pug');

// Créez un price_id pour un produit
async function createPrice(product){
    return await stripe.prices.create({
        unit_amount: product.unit_amount,
        currency: 'eur',
        product: product._id,
    });
}

// Créez une liste d'item avec leurs price_id et la quantité
async function createLineItem(cart){
    var line_items = []
    for(let i = 0; i < cart.articlesList.length; i++){
        var article = cart.articlesList[i];
        line_items.push(
            {
                price: createPrice(article),
                quantity: article.qty,
            }
        );
    }

    return line_items;
}

app.post('/create-checkout-session', async(req, res) => {
    const session = await stripe.checkout.sessions.create({
        line_items: [
            //createLineItem(req.body.cart)
            {
                price: process.env.PRICE_ID,
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${DOMAIN}/success`,
        cancel_url: `${DOMAIN}/error`,
    });

    res.redirect(303, session.url);
});

app.get('/checkout', async(req, res) => {
    res.render('payment');
});

//Start the server
app.listen(4242, () => console.log('Running on port 4242')); 