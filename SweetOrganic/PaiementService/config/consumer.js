//const amqp = require("amqplib");

const amqp = require('amqp-connection-manager');
const dotenv = require('dotenv');
dotenv.config();
//Library Stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const {createPrice, createLineItem} = require('../service/controllers/stripeController');
//const isDocker = process.env.DOCKER === "true";
//const amqpUrl = isDocker ? process.env.AMQ_URL_DOCKER : process.env.AMQ_URL;
const channelMax = 2047; // Limite maximale des canaux
if(process.env.HOSTNAME){var amqpUrl = process.env.AMQ_URL_DOCKER;}
else {var amqpUrl = process.env.AMQ_URL;}

/*const connectMsgBroker = async () =>{

}*/


/*const receive_articles = async (req, res) => {

    //Créez une connection à RabbitMQ
    const connection = await amqp.connect(amqpUrl);

    //Creez une file d'attente
    var channel = await connection.createChannel();

    console.log("Docker host : " + process.env.DOCKER_HOST);
    console.log("url " +amqpUrl);

    //Queue name
    var queue = "payment"; 
    await channel.assertQueue(queue, {
        durable: true
    }); 
   
    //Receptioon du message 
    console.log(" [*] Waiting for messages in %s.", queue);

    await channel.consume('/create-checkout-session', (message) => {
        // Traitez le message et extrayez les informations du panier
        const cartData = JSON.parse(message.content.toString());

        // Creation d'une session checkout Stripe
        try{
            var session = stripe.checkout.sessions.create({
                line_items: createLineItem(cartData),
                mode: 'payment',
                success_url: `http://localhost:${port}/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `http://localhost:${port}/error`,
            });
        }catch(err){
            return res.send(err);
        }

        res.redirect(303, session.url);
    });

}*/
/*
async function receive_articles(){
    console.log("url " +amqpUrl);
    amqp.connect(amqpUrl, function(error0, connection) {
        if (error0) {
            throw error0;
        }
        console.log("Connection à Rabbitmq réussi.");
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }
            console.log("Création d'un canal réusii.");
            var queue = 'payment';
    
            channel.assertQueue(queue, {
                durable: false
            });
    
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
    
            channel.consume(queue, function(msg) {
                console.log(" [x] Received %s", msg.content.toString());
            }, {
                noAck: true
            });
        });
    });

}*/





//module.exports = receive_articles;
