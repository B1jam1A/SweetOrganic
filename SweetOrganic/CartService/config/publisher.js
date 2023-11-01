const amqp = require('amqplib');
//const amqp = require('amqp-connection-manager');
//Connect to message brocker Rabbitmq
if(process.env.HOSTNAME){var amqpUrl = process.env.MONGODB_URL_DOCKER;}
else {var amqpUrl = process.env.MONGODB_URL;}

//Fonction test pour envoyé un message
async function sendMessage(){

    //Créez une connection à RabbitMQ
    const connection = await amqp.connect("amqp://127.0.0.1:5672");

    //Creez une file d'attente
    const channel = await connection.createChannel();

    //Queue name
    var queue = "cart";

    //Message
    const message = {
        user: 'Jhonny',
        productId: 123,
        quantity: 1,
    };

    await channel.assertQueue(queue, {
        durable: true
    });

    //Envoie du message
    await channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    console.log(" [x] Sent %s", message);

    //Stop la connection
    setTimeout(function(){
        connection.close();
        process.exit(0);
    }, 500);

}


//Fonction pour envoyé un message pour le paiement
/*async function sendMessage_Payment(){

    //Créez une connection à RabbitMQ
    const connection = await amqp.connect(amqpUrl);

    //Creez une file d'attente
    const channel = await connection.createChannel();

    //Queue name
    var queue = "payment";

    //Message
    const message = [
        {
            article_name: 'article_1',
            price_id: 'price_1O5vVULisy8csVQhwH5UfipG',
            quantity: 4,
        },

        {
            article_name: 'article_2',
            price_id: 'price_1O7agNLisy8csVQh7EdPL56M',
            quantity: 2,
        },
    ];

    await channel.assertQueue(queue, {
        durable: true
    });

    //Envoie du message
    await channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    console.log(" [x] Sent %s", message);

    //Stop la connection
    setTimeout(function(){
        connection.close();
        process.exit(0);
    }, 500);

}*/





const q = "payment"
/*const sendToPayment = async() => {
    const connection = await amqp.connect('amqp://rabbitmq:5672');

    /*let channel = connection.createChannel({
        json: true,
        setup: ch =>{
            return ch.assertQueue(q, { durable: true});
        }
    });*//*
    const channel = await connection.createChannel();
    const result = await channel.assertQueue('payment');
    console.log("Send to payment.");
    
    const message = [
        {
            article_name: 'article_1',
            price_id: 'price_1O5vVULisy8csVQhwH5UfipG',
            quantity: 4,
        },

        {
            article_name: 'article_2',
            price_id: 'price_1O7agNLisy8csVQh7EdPL56M',
            quantity: 2,
        },
    ];

    await channel.sendToQueue(q, JSON.stringify(message));
    console.log("Message envoie à payment");
    //channel.close();
    //connection.close();

}*/

async function sendToPayment(message){
    try{
        const connection = await amqp.connect('amqp://rabbitmq:5672');
        const channel = await connection.createChannel();
        const result = await channel.assertQueue('payment');
        /*let message = [
            {
                article_name: 'article_3',
                price_id: 'price_1O7i0iLisy8csVQhhcK7G8Lp',
                quantity: 4,
            },
            {
                article_name: 'article_2',
                price_id: 'price_1O7agNLisy8csVQh7EdPL56M',
                quantity: 2,
            },
        ];*/

        console.log("type avant envoie : "+ typeof message);
        channel.sendToQueue('payment', Buffer.from(JSON.stringify(message)));

    }catch(error){
        console.log(error);
    }
}
//sendToPayment()

module.exports.sendToPayment = sendToPayment;