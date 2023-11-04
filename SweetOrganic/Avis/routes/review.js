const router = require('express').Router();
const Review = require('../model/Review');
const {authentification} = require('./verifyToken');
const amqp = require('amqplib');


let channel = null;

async function connectRabbitMQ() {
    const connection = await amqp.connect(process.env.MQ_CONNECT); 
    channel = await connection.createChannel();
    await channel.assertQueue('gestionAvisId');
}

connectRabbitMQ();

function sendToQueue(action, productId, reviewId) {
    const message = {
        action: action,
        productId: productId,
        reviewId: reviewId
    };
    channel.sendToQueue('gestionAvisId', Buffer.from(JSON.stringify(message)));
}


// Route POST pour ajouter un avis
router.post('/', authentification, (req, res) => {
    const client_id = req._id;
    const { produit_id, notation, commentaire } = req.body;

    // Vérifiez si le client a déjà laissé un avis pour ce produit
    Review.findOne({ client_id: client_id, produit_id: produit_id })
        .then(existingReview => {
            if (existingReview) {
                // Si un avis existe déjà, retournez une réponse indiquant que l'utilisateur ne peut pas laisser un autre avis
                throw new Error('AlreadyReviewed');
            }

            // Si l'utilisateur n'a pas encore laissé d'avis, créez un nouvel avis
            const newReview = new Review({
                client_id,
                produit_id,
                notation,
                commentaire
            });

            return newReview.save();
        })
        .then(avis => {
            // Envoyer le message à RabbitMQ après l'ajout d'un avis
            sendToQueue('addReview', produit_id, avis._id.toString());
            
            res.status(201).json({ message: 'Avis ajouté avec succès!', avis });
        })
        .catch(err => {
            if (err.message === 'AlreadyReviewed') {
                res.status(400).json({ message: 'Vous avez déjà laissé un avis pour ce produit.' });
            } else {
                res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'avis', error: err.message });
            }
        });
});


// Route DELETE pour supprimer un avis
router.delete('/:id', authentification, (req, res) => {
    if (req.user !== 'admin') {
        return res.status(403).send('Access denied. Only administrators can add products.');
    }

    const reviewId = req.params.id;

    // Trouvez l'avis avant de le supprimer pour obtenir son produit_id
    Review.findById(reviewId)
        .then(review => {
            if (!review) {
                return res.status(404).json({ message: 'Avis non trouvé.' });
            }

            const productId = review.produit_id;

            // Supprimez l'avis maintenant
            Review.findByIdAndRemove(reviewId)
                .then(() => {
                    // Envoyer le message à RabbitMQ après la suppression d'un avis
                    sendToQueue('deleteReview', productId.toString(), reviewId);

                    res.status(200).json({ message: 'Avis supprimé avec succès!' });
                })
                .catch(err => {
                    res.status(500).json({ message: 'Erreur lors de la suppression de l\'avis', error: err });
                });
        })
        .catch(err => {
            res.status(500).json({ message: 'Erreur lors de la recherche de l\'avis', error: err });
        });
});


// Route GET pour récupérer tous les avis d'un produit spécifique
router.get('/product/:id', authentification, (req, res) => {

    if (req.user !== 'admin') {
        return res.status(403).send('Access denied. Only administrators can access this.');
    }

    const productId = req.params.id;

    // Recherchez tous les avis associés à ce produit
    Review.find({ produit_id: productId })
        .then(reviews => {
            if (!reviews || reviews.length === 0) {
                return res.status(404).json({ message: 'Aucun avis trouvé pour ce produit.' });
            }
            // Au lieu d'extraire uniquement les commentaires, renvoyez tous les avis
            res.status(200).json(reviews);
        })
        .catch(err => {
            res.status(500).json({ message: 'Erreur lors de la récupération des avis', error: err });
        });
});

// Route GET pour récupérer tous les avis d'un client spécifique
router.get('/customer/:id', authentification, (req, res) => {

    if (req.user !== 'admin') {
        return res.status(403).send('Access denied. Only administrators can access this.');
    }

    const clientId = req.params.id;

    // Recherchez tous les avis associés à ce client
    Review.find({ client_id: clientId })
        .then(reviews => {
            if (!reviews || reviews.length === 0) {
                return res.status(404).json({ message: 'Aucun avis trouvé pour ce client.' });
            }
            // Renvoyez tous les avis du client
            res.status(200).json(reviews);
        })
        .catch(err => {
            res.status(500).json({ message: 'Erreur lors de la récupération des avis', error: err });
        });
});

// Route GET pour récupérer les avis d'un client spécifique sur un produit spécifique
router.get('/customer/product/:id', authentification, (req, res) => {
    const clientId = req._id;
    const productId = req.params.id;

    console.log(req._id)

    // Recherchez les avis associés à ce client pour le produit spécifié
    Review.find({ client_id: clientId, produit_id: productId })
        .then(reviews => {
            if (!reviews || reviews.length === 0) {
                return res.status(404).json({ message: 'Aucun avis trouvé pour ce client sur ce produit.' });
            }
            // Renvoyez les avis du client pour le produit spécifié
            res.status(200).json(reviews);
        })
        .catch(err => {
            res.status(500).json({ message: 'Erreur lors de la récupération des avis', error: err });
        });
});









module.exports = router;