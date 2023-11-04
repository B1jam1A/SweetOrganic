#!/usr/bin/env node

//Connect to message brocker Rabbitmq

const amqp = require('amqplib');

if(process.env.HOSTNAME){var amqpUrl = process.env.AMQ_URL_DOCKER;}
else {var amqpUrl = process.env.AMQ_URL;}

async function sendPriceId(price_id){
    try{
        const connection = await amqp.connect(amqpUrl);
        const channel = await connection.createChannel();

        await channel.assertQueue('sendPriceID');
        channel.sendToQueue('sendPriceID', Buffer.from(JSON.stringify(price_id)));

    }catch(error){
        console.log(error);
    }

}

module.exports = {
    sendPriceId,
}