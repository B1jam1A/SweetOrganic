//Get the packages we need
var express = require('express');
var bodyParser = require('body-parser');
const connectToDb = require('./config/paymentDB');
const Payment = require('./service/models/paymentModel')
const dotenv = require('dotenv');
const {createPrice, createLineItem} = require('./service/controllers/stripeController');
//const receive_articles = require('./config/consumer');
const {authentification} = require('./api/verifyToken');

dotenv.config();

//Connect to the MongoDB
connectToDb();
//receive_articles();

const amqp = require('amqplib');
//const amqp = require('amqp-connection-manager');
const { resolve } = require('path');
//const { channel } = require('diagnostics_channel');

let cartData;

async function connectToMQ(){
    try{
        const connection = await amqp.connect('amqp://rabbitmq:5672');
        const channel = await connection.createChannel();
        const result = await channel.assertQueue('payment');
        
        channel.consume("payment", message => {
            const messageContent = message.content.toString();
            cartData = JSON.parse(messageContent);
            console.log(message.content.toString());
        })
        console.log("waiting message");


    }catch(error){
        console.log(error);
    }
}
connectToMQ();

const q = 'payment';
const receive_articles = async () => {
    //Utilisation des promises pour attendre que la file d'attente soit consommée et renvoyer les données une fois dispo
    /*return new Promise( async (resolve, reject) => {
        const connection = amqp.connect('amqp://rabbitmq:5672');

        try{
            let channel = connection.createChannel({
                json: true,
                setup: ch =>{
                    return ch.assertQueue(q, { durable: true});
                }
            });
        
            console.log(" [*] Waiting for messages in %s.", q);
            await channel.consume(q, (message) => {
                console.log(" [*] Parsing des données...");
                const cartData = JSON.parse(message.content.toString());
                console.log(message.content.toString());
                resolve(cartData);
            }, { noAck: true, exclusive: false});

            console.log(" [*] Donner techniquement reçu.");
            //channel.close();
            
        }catch (error) {
            reject(error);
        }

        //connection.close();
    });*/


};

//receive_articles();

//Library Stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
 
//Create our Express application
var app = express(); 

//Use environment defined port or 4242
const port = process.env.PORT || 3000;
const DOMAIN = `http://localhost:${port}`;
console.log('DOMAINE = ' + DOMAIN);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

// Utiliser EJS comme moteur de rendu
app.set('view engine', 'pug');

//Creation d'une session avec Stripe
app.post('/create-checkout-session', authentification, async(req, res) => {


    const user_id = req.decodedToken._id;
    
    if(cartData.user_id !== user_id){
        console.log("cartData.user_id: "+ cartData.user_id );
        console.log("user_id: "+ user_id);
        return res.status(403).send("Forbbiden request: Payment service refused");
    }
    console.log("Identifié : "+user_id);
    try{
    //const cartData = await receive_articles();


    console.log("La session checkout à reçu le panier !");
    console.log(cartData);
    console.log("type après envoie: " + typeof cartData);
        var session = await stripe.checkout.sessions.create({
            line_items: createLineItem(cartData.articlesList),
                /*{
                    price: process.env.PRICE_ID,
                    quantity: 1,
                },*/
            
            mode: 'payment',
            success_url: `http://localhost:${port}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:${port}/error`,
        });
    }catch(err){
        return res.send(err);
    }
    console.log("session url: " + session.url)
    console.log("Sessions status : "+ session.status);
    console.log("Redirection vers une nouvelle page...");
    //res.status(303).redirect(session.url);
    res.status(200).send({url: session.url});
    //receive_articles(req, res);
});


app.get('/success', async (req, res) => {
    // Récupérez la l'indentifiant de la session depuis l'URL
    const session_id = req.query.session_id;
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if(!session){
        return res.status(403).send("Forbbiden request: Vous devez effectuer un paiment");
    }
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
    //res.render('success', {session});
    //res.send({session});

    // Construire l'URL complète de redirection
    const redirectURL = `http://localhost:4000/success?session_id=${session_id}`;

    // Rediriger l'utilisateur vers l'URL de succès sur le port 4000
    res.redirect(redirectURL);

});

app.get('/checkout', async(req, res) => {
    res.send({title: 'Checkout'});
});

//Start the server
app.listen(3000, () => console.log(`Running on port ${port}`)); 