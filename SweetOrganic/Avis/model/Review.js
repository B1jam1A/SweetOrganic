const mongoose = require('mongoose');

// Définition du schéma
const ReviewSchema = new mongoose.Schema({
    // avis_id sera créé automatiquement sous le nom "_id" par MongoDB

    client_id: {
        type: mongoose.Schema.Types.ObjectId,  // Utilisez ObjectId pour référencer un autre document
        required: true
    },

    produit_id: {
        type: mongoose.Schema.Types.ObjectId,  // Utilisez ObjectId pour référencer un autre document
        required: true
    },

    notation: {
        type: Number,
        required: true,
        min: 1,   // Notation minimale
        max: 5    // Notation maximale
    },

    commentaire: {
        type: String,
        required: true,
        maxlength: 2000  // Limite à 2000 caractères
    },

    date_publication: {
        type: Date,
        default: Date.now   // Par défaut, utilise la date actuelle
    }
});

// Création du modèle
const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;
