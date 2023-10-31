#!/usr/bin/env node

//Connect to message brocker Rabbitmq

const amqp = require('amqplib');

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

sendMessage();
