const amqp = require("amqplib");
const dotenv = require('dotenv');
dotenv.config();

if(process.env.HOSTNAME){var amqpUrl = process.env.MONGODB_URL_DOCKER;}
else {var amqpUrl = process.env.MONGODB_URL;}

async function receiveMessage(){
     
    console.log("Docker host : " + process.env.DOCKER_HOST);
    console.log("url " +amqpUrl);
    //Créez une connection à RabbitMQ
    const connection = await amqp.connect(AMQ_URL_DOCKER);

    //Creez une file d'attente
    const channel = await connection.createChannel();

    //Queue name
    var queue = "cart"; 
    await channel.assertQueue(queue, {
        durable: true
    }); 

    //Receptioon du message 
    console.log(" [*] Waiting for messages in %s.", queue);
    await channel.consume(queue, async function(message){
        //TODO... Mettre un système de lecture du message
        console.log(" [x] Received %s", await message.content.toString());
        
        
    }, { 
        noAck: true
    });
}

module.exports = receiveMessage;
