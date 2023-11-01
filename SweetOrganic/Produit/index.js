const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const amqp = require('amqplib');


dotenv.config();

//Importer les routes
const productRoute = require('./routes/product');

async function connectToDb() {
    try {
        await mongoose.connect(
            process.env.DB_CONNECT, 
            { useNewUrlParser: true }
        );
        console.log('Connecté à la base de données MongoDB avec succès!');
    } catch (error) {
        console.error('Erreur lors de la connexion à la base de données:', error);
    }
}
connectToDb();

async function connectToMQ(){
    try{
        const connection = await amqp.connect(process.env.MQ_CONNECT);
        const channel = await connection.createChannel();
        const result = await channel.assertQueue('jobs');
        channel.sendToQueue('jobs', Buffer.from("Un message a été envoyé depuis le MS Produit"))

    }catch(error){
        console.log(error);
    }
}
connectToMQ()

//Middleware
app.use(express.json());

//Route Middlewares
app.use('/api/product', productRoute);


app.listen(process.env.PORT, () => console.log("Serveur en cours d'exécusion"));