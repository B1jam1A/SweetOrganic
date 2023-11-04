const router = require('express').Router();
const Product = require('../model/Product');
const {authentification} = require('./verifyToken');
const amqp = require('amqplib');

async function addCartToMQ(product, userId) {
    try {
        const connection = await amqp.connect(process.env.MQ_CONNECT);
        const channel = await connection.createChannel();
        const queue = 'ajouterPanier';

        const message = {
            user_id: userId,
            article:{
                idProduit: product._id.toString(),
                nom: product.nom,
                prix: product.prix.toString(),
                price_id: product.price_id || "", 
            }
        };

        const messageBuffer = Buffer.from(JSON.stringify(message));

        await channel.assertQueue(queue, { durable: true });
        channel.sendToQueue(queue, messageBuffer);

        console.log("Product added to cart and sent to RabbitMQ:", message);

    } catch (error) {
        console.error("Error adding product to cart and sending to RabbitMQ:", error);
    }
}

async function sendProductForPriceId(product) {
    try {
        const connection = await amqp.connect(process.env.MQ_CONNECT);
        const channel = await connection.createChannel();
        const queue = 'getPriceID';

        const message = {
            idProduit: product._id.toString(),
            nom: product.nom.toString(),
            prix: product.prix.toString(),

        };

        const messageBuffer = Buffer.from(JSON.stringify(message));

        await channel.assertQueue(queue, { durable: true });
        channel.sendToQueue(queue, messageBuffer);

        console.log("Product id and price send to RabbitMQ:", message);

    } catch (error) {
        console.error("Error adding product to cart and sending to RabbitMQ:", error);
    }


}


async function receivedPriceIDFromMQ() {
    try {
        const connection = await amqp.connect(process.env.MQ_CONNECT);
        const channel = await connection.createChannel();
        
        const queue = 'sendPriceID';
        await channel.assertQueue(queue);

        // Écoute des messages
        channel.consume(queue, async message => {
            const messageContent = message.content.toString();
            try {
                const jsonMessage = JSON.parse(messageContent);
                console.log("Received JSON Message:", jsonMessage);

                const updateResult = await Product.updateOne(
                    { _id: jsonMessage.idProduit },
                    { $set: { price_id: jsonMessage.price_id } }
                );
                if (updateResult.nModified > 0) {
                    console.log(`Product with id ${jsonMessage.idProduit} has been updated with price_id: ${jsonMessage.price_id}`);
                } else {
                    console.warn(`No product found with id ${jsonMessage.idProduit}`);
                }

            } catch (parseError) {
                console.error("Failed to parse JSON:", parseError);
            }

            // Acknowledge the message
            channel.ack(message);

        }, { noAck: false });

        console.log("Waiting for messages price_id from RabbitMQ...");

    } catch (error) {
        console.log(error);
    }
}

receivedPriceIDFromMQ(); 


async function listenForReviews() {
    const connection = await amqp.connect(process.env.MQ_CONNECT);
    const channel = await connection.createChannel();
    
    const queue = 'gestionAvisId';
    await channel.assertQueue(queue);

    channel.consume(queue, async message => {
        const msgContent = message.content.toString();
        const { action, productId, reviewId } = JSON.parse(msgContent);
        
        const product = await Product.findById(productId);
        if (!product) return;

        if (action === 'addReview') {
            if (!product.avisIds.includes(reviewId)) {
                product.avisIds.push(reviewId);
            }
        } else if (action === 'removeReview') {
            const index = product.avisIds.indexOf(reviewId);
            if (index > -1) {
                product.avisIds.splice(index, 1);
            }
        }

        await product.save();
        channel.ack(message);
    });
}

listenForReviews();





//Visualiser Produits
router.get('/all', async (req, res) => {
    try{
        const products = await Product.find();  // récupérer tous les produits
        res.send(products);  // renvoyer la liste de tous les produits
    }catch(err){
        res.status(500).send("An error occurred while fetching the products.");
    }
});

// //Trier Produits
// router.get('/', async (req, res) => {
//     try {
//         // Supposons que les catégories sont passées via une query string, comme: ?categories=bonbon,chocolat
//         let categories = req.query.categories;

//         // Si aucune catégorie n'est fournie, renvoyez une erreur
//         if (!categories) {
//             return res.status(400).send('Please provide at least one category.');
//         }

//         // Convertir la chaîne des catégories en tableau
//         categories = categories.split(',');

//         // Recherche des produits par catégorie(s)
//         const products= await Product.find({ categorie: { $in: categories } }).exec();

//         // Envoie des produits trouvés en réponse
//         res.json(products);
//     } catch (error) {
//         res.status(500).send("An error occurred while sort the products.");
//     }
// });

//Trier Produits
router.post('/sort', async (req, res) => { 
    try {
        // Supposons que les catégories sont passées via le corps de la requête sous forme de tableau JSON
        const categories = req.body.categories;

        // Si aucune catégorie n'est fournie, renvoyez une erreur
        if (!categories || !Array.isArray(categories) || categories.length === 0) {
            return res.status(400).send('Please provide at least one category.');
        }

        // Recherche des produits par catégorie(s)
        const products = await Product.find({ categorie: { $in: categories } }).exec();

        // Envoie des produits trouvés en réponse
        res.json(products);
    } catch (error) {
        res.status(500).send("An error occurred while sorting the products.");
    }
});

module.exports = router;

//Ajouter Produit
router.post('/', authentification, async (req, res) => {
    try {
        if (req.user !== 'admin') {
            return res.status(403).send('Access denied. Only administrators can add products.');
        }



        // Créez un nouveau produit en utilisant le modèle Mongoose et les données fournies dans req.body
        const product= new Product(req.body);

        // Sauvegardez le produit dans la base de données
        await product.save();

        // Envoyer le produit à RabbitMQ en utilisant la fonction sendProductForPriceId
        await sendProductForPriceId(product);

        // Renvoyez le produit nouvellement créé en réponse
        res.json(product);
    } catch (error) {
        console.error(error)
        res.status(500).send(error);
    }
});

// Modifier un produit
router.put('/:id', authentification, async (req, res) => {
    try {
        if (req.user !== 'admin') {
            return res.status(403).send('Access denied. Only administrators can modify a product.');
        }
        const productId = req.params.id;
        
        // Vérification de la présence de l'ID du produit
        if (!productId) {
            return res.status(400).send('Product ID is required.');
        }

        // Recherche du produit à modifier
        let product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send('Product not found.');
        }

        // Mise à jour du produit avec les données fournies
        // (Cela suppose que toutes les propriétés du produit sont envoyées dans le corps de la requête. 
        // Si certaines propriétés sont optionnelles, vous devrez les traiter séparément)
        product = await Product.findByIdAndUpdate(productId, req.body, { new: true });

        // Envoie du produit mis à jour en réponse
        res.json(product);

    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).send("An error occurred while updating the product.");
    }
});

// Supprimer un produit
router.delete('/:id', authentification, async (req, res) => {
    try {
        if (req.user !== 'admin') {
            return res.status(403).send('Access denied. Only administrators can delete a product.');
        }
        const productId = req.params.id;
        
        // Vérification de la présence de l'ID du produit
        if (!productId) {
            return res.status(400).send('Product ID is required.');
        }

        // Suppression du produit
        const product = await Product.findByIdAndRemove(productId);

        if (!product) {
            return res.status(404).send('Product not found.');
        }

        // Envoie d'une réponse confirmant la suppression
        res.json({ message: 'Product successfully deleted.' });

    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).send("An error occurred while deleting the product.");
    }
});


router.post('/addCart', authentification, async (req, res) => {
    try {
        const productId = req.body.idProduit;
        const product = await Product.findById(productId);
        const user_id = req._id;
        if (!product) {
            return res.status(404).send('Product not found.');
        }

        // Envoyer le produit à RabbitMQ en utilisant la fonction addCartToMQ
        await addCartToMQ(product, user_id);

        res.json({ message: 'Product added to cart and sent to RabbitMQ successfully!' });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("An error occurred.");
    }
});









module.exports = router;