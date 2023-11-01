const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();

if(process.env.HOSTNAME){var dbUrl = process.env.MONGODB_URL_DOCKER;}
else {var dbUrl = process.env.MONGODB_URL;}

console.log("dbUrl = "+dbUrl)

async function connectToDb() {
    try {
        await mongoose.connect(
            process.env.MONGODB_URL_DOCKER, 
            { useNewUrlParser: true }
        );
        console.log('Connecté à la base de données MongoDB avec succès!');
    } catch (error) {
        console.error('Erreur lors de la connexion à la base de données:', error);
    }
}

module.exports = connectToDb;
