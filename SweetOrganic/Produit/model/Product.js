const mongoose = require('mongoose');

// Définition du schéma
const productSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    prix: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    categorie: {
        type: String,
        required: true,
        trim: true,
        enum: ['bonbon', 'chocolat', 'guimauve'] // Vous pouvez ajouter ou supprimer des catégories ici
    },
    ingredients: [{
        type: String,
        trim: true
    }],
    image: {
        url: {
            type: String,
            required: true,
            trim: true
        },
        alt: {
            type: String,
            trim: true
        }
    },
    dateAjout: {
        type: Date,
        default: Date.now
    },
    avisIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Avis' // Ceci fait référence à la collection d'avis, à condition que vous ayez un schéma d'avis avec le nom "Avis".
    }],
    statut: {
        type: String,
        enum: ['actif', 'inactif'],
        default: 'actif'
    },
    price_id: {
        type: String,
        required: false
    }
});

// Création du modèle
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
