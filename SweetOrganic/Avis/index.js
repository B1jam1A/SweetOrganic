const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const amqp = require('amqplib');


dotenv.config();

//Importer les routes
const reviewRoute = require('./routes/review');

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

connectToDb()


//Middleware
app.use(express.json());

//Route Middlewares
app.use('/api/review', reviewRoute);


app.listen(process.env.PORT, () => console.log("Serveur en cours d'exécusion"));