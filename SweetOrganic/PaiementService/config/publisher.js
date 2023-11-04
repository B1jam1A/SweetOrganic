#!/usr/bin/env node

//Connect to message brocker Rabbitmq

const amqp = require('amqplib');

if(process.env.HOSTNAME){var amqpUrl = process.env.AMQ_URL_DOCKER;}
else {var amqpUrl = process.env.AMQ_URL;}

async function sendPriceId(msg){
    console.log("price_id before send : " + msg);
    if(msg){
        try{
            const connection = await amqp.connect(amqpUrl);
            const channel = await connection.createChannel();
    
            const result = await channel.assertQueue('sendPriceID', { durable: true });
            //console.log("Queue créer !", result.queue);
            const message = Buffer.from(JSON.stringify(msg));
            channel.sendToQueue('sendPriceID', message);
            console.log("Message envoyé ! " + message);
        }catch(error){
            console.log(error);
        }
    } else{
        console.log("Aucun msg envoyé !");
    }
}

module.exports = {
    sendPriceId,
}