//Get the packages we need
var express = require('express');
var bodyParser = require('body-parser');
const connectToDb = require('./config/paymentDB');
const Payment = require('./service/models/paymentModel')
const dotenv = require('dotenv');
const {createPrice, createLineItem} = require('./service/controllers/stripeController');
dotenv.config();

//Connect to the MongoDB
connectToDb();

//Library Stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
 
//Create our Express application
var app = express(); 

//Use environment defined port or 4242
var port = process.env.PORT;
const DOMAIN = `http://localhost:${port}`;
console.log('DOMAINE = ' + DOMAIN);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

// Utiliser EJS comme moteur de rendu
app.set('view engine', 'pug');

//Creation d'une session avec Stripe
app.post('/create-checkout-session', async(req, res) => {
    try{
        var session = await stripe.checkout.sessions.create({
            line_items: [
                //createLineItem(req.body.cart)
                {
                    price: process.env.PRICE_ID,
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `http://localhost:${port}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:${port}/error`,
        });
    }catch(err){
        return res.send(err);
    }

    console.log("Sessions status : "+ session.status);
    console.log("Redirection vers une nouvelle page...");
    res.redirect(303, session.url);
});


app.get('/success', async (req, res) => {
    // Récupérez la l'indentifiant de la session depuis l'URL
    const session_id = req.query.session_id;
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    console.log("Paiement status : "+ session.payment_status);
    //Si la transation a été un success, enregistre le payment dans la base de donnée
    if(session.payment_status === "paid"){
        // Le paiement a été effectué avec succès
        var payment = new Payment();

        payment.user_id = "123456";
        payment.amount = session.amount_total;
        payment.status = session.status;
        payment.payment_date = new Date();
        payment.intent_id = session.payment_intent;
        
        await payment.save();
    } else {
        console.log("Paiement échoué.");
    }

    //Affiche la page de confirmation de paiement
    res.render('success', {session});
});

app.get('/checkout', async(req, res) => {
    res.render('payment');
});

//Start the server
app.listen(3000, () => console.log('Running on port 3000')); 