const amqp = require('amqplib');

if(process.env.HOSTNAME){var amqpUrl = process.env.AMQ_URL_DOCKER;}
else {var amqpUrl = process.env.AMQ_URL;}

async function sendToPayment(message){
    try{
        const connection = await amqp.connect(amqpUrl);
        const channel = await connection.createChannel();
        const result = await channel.assertQueue('payment');
        console.log("type avant envoie : "+ typeof message);
        channel.sendToQueue('payment', Buffer.from(JSON.stringify(message)));

    }catch(error){
        console.log(error);
    }
}
//sendToPayment()

module.exports.sendToPayment = sendToPayment;