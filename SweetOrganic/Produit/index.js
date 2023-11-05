const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const amqp = require('amqplib');
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:4200'
  }));



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




//Ajouter une route pour le dossier images
app.use('/images', express.static('./images'));

//Middleware
app.use(express.json());

//Route Middlewares
app.use('/api/product', productRoute);


app.listen(process.env.PORT, () => console.log("Serveur en cours d'exécusion"));