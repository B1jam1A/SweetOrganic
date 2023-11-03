const router = require('express').Router();
const Review = require('../model/Review');
const {authentification} = require('./verifyToken');
const amqp = require('amqplib');


// Route POST pour ajouter un avis
app.post('/', (req, res) => {
    // Récupère les données de la requête
    const { client_id, produit_id, notation, commentaire } = req.body;

    // Crée une nouvelle instance de l'avis avec ces données
    const newReview = new Review({
        client_id,
        produit_id,
        notation,
        commentaire
    });

    // Enregistre l'avis dans la base de données
    newReview.save()
        .then(avis => {
            res.status(201).json({ message: 'Avis ajouté avec succès!', avis });
        })
        .catch(err => {
            res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'avis', error: err });
        });
});


// Route DELETE pour supprimer un avis
app.delete('/:id', authentification, (req, res) => {
    if (req.user !== 'admin') {
        return res.status(403).send('Access denied. Only administrators can add products.');
    }
    const reviewId = req.params.id;

    // Recherchez et supprimez l'avis par ID
    Review.findByIdAndRemove(reviewId)
        .then(review => {
            if (!review) {
                return res.status(404).json({ message: 'Avis non trouvé.' });
            }
            res.status(200).json({ message: 'Avis supprimé avec succès!' });
        })
        .catch(err => {
            res.status(500).json({ message: 'Erreur lors de la suppression de l\'avis', error: err });
        });
});

// Route GET pour récupérer tous les commentaires d'un produit spécifique
app.get('/product/all', authentification, (req, res) => {

    if (req.user !== 'admin') {
        return res.status(403).send('Access denied. Only administrators can add products.');
    }

    const productId = req.params.product_id;

    // Recherchez tous les avis associés à ce produit
    Review.find({ produit_id: productId })
        .then(review => {
            if (!review|| review.length === 0) {
                return res.status(404).json({ message: 'Aucun commentaire trouvé pour ce produit.' });
            }
            // Extrait uniquement les commentaires des avis
            const commentaires = review.map(a => a.commentaire);
            res.status(200).json(commentaires);
        })
        .catch(err => {
            res.status(500).json({ message: 'Erreur lors de la récupération des commentaires', error: err });
        });
});








module.exports = router;