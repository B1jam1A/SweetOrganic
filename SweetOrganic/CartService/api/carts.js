var express = require('express');
var router = express.Router();
var Cart = require ('../service/models/cartModel');
const {authentification} = require('./verifyToken');
var {sendToPayment} = require('../config/publisher');
const {getArticlePrice, getTotalPrice, addArticle, prepareMsg, isAdmin, verifyCart} = require('../service/controllers/cartsController');
const amqp = require('amqplib');

async function connectToMQ(){
  try{
      const connection = await amqp.connect('amqp://rabbitmq:5672');
      const channel = await connection.createChannel();

      await channel.assertQueue('creerPanier');
      channel.consume("creerPanier", message => {
          const messageContent = message.content.toString();
          console.log(messageContent);
          //cartData = JSON.parse(messageContent);
      });

      await channel.assertQueue('ajouterProduit');
      channel.consume("ajouterProduit", async message => {
        const messageContent = await message.content.toString();
        console.log(messageContent);

        //Ajout d'un article
        const addProductData = await JSON.parse(messageContent);
        await addArticle(addProductData.article, user_id);
        console.log("Produit ajouté !");
    });

      console.log("waiting message");


  }catch(error){
      console.log(error);
  }
}
connectToMQ();


router.get('/redirect-payment',authentification,  async function(req, res) {
  console.log("Préparation du panier");


  //Récupère le panier
  const temp_cart = await Cart.find({ user_id: req.decodedToken._id}); //Tableau panier 
  var cart = temp_cart[0];

  
  //console.log(cart);
  //Regarde si le tableau est vide
  if(!cart){
    return res.status(401).json({message: 'Votre panier est vide.'});
  }

  console.log("Panier trouvé !");

  const message = prepareMsg(cart);

  console.log('message : '+ message);
  await sendToPayment(message);
  // Construire l'URL complète de redirection
  //const redirectURL = `http://localhost:4000/checkout`;

  // Rediriger l'utilisateur vers l'URL de succès sur le port 4000
  res.status(200).json({message: 'Préparation de la commande.'});
});

/* GET cart page. */
router.get('/', authentification, async function(req, res, next) {
  try{
    console.log("Récupère le panier");
    //Récupère le panier
    const temp_cart = await Cart.find({ user_id: req.decodedToken._id}); //Tableau panier 
    var cart = temp_cart[0];

    //Regarde si le tableau est vide
    if(!cart){
      console.log("Aucun panier trouvé");
      let new_cart = new Cart();
      new_cart.user_id = req.decodedToken._id;
      cart = new_cart;
      await cart.save();
    }
    
    //Récupère les articles
    const articlesList = cart.articlesList;

    //Affiche la page panier avec les articles
    //res.render('carts', { title: 'Mon panier', articlesList, getArticlePrice, getTotalPrice});
    var listArticlePrice = [];
    for(let i=0; i < articlesList.length; i++){
      listArticlePrice.push(getArticlePrice(articlesList[i]));
    }
    const totalPrice = getTotalPrice(articlesList);
    res.status(200).send({ title: 'Mon panier', articlesList, listArticlePrice, totalPrice});
  
  }catch(err){
    res.json(err);
  }
});


// Ajout d'un panier manuellement par l'utilisateur
router.post('/addCart', authentification, isAdmin, async function(req, res){

  //Create a new instance of cart model
  var cart = new Cart();

  //Set the cart properties that came from the POST data
  cart.user_id = req.body.user_id;
  cart.date = req.body.date;
  cart.articlesList = req.body.articlesList;

  //Save the cart ad check for errors
  try{
    var saveCart = await cart.save();
    res.json({message: 'Cart added', data:saveCart});
  }catch(err){
    res.send(err);
  }
});


// Accède à tous les paniers disponible
router.get('/allCarts', authentification, isAdmin, function(req, res){
  Cart.find().then(carts=>res.json(carts)).catch(err=>res.send(err));
});


// Accède à un seul panier par son identifiant
router.get('/allCarts/:cart_id', authentification, isAdmin, async function(req, res){
  Cart.findById(req.params.cart_id).then(cart=>res.json(cart)).catch(err=>res.send(err));
});


// Ajouter un article à un panier
router.post('/allCarts/:cart_id/articles', authentification, verifyCart, async function(req, res){
  try{
    //Identifiant du panier
    const cart_id = req.params.cart_id;

    //Nouvelle article
    const newArticle = {
      idArticle: req.body.idArticle,
      name: req.body.name,
      quantity: req.body.quantity,
      price: req.body.price,
      price_id: req.body.price_id,
    };

    //Recherchez le panier par son ID (carID)
    const cart = await Cart.findByIdAndUpdate(cart_id);
    if(!cart){return res.status(404).json({message: 'Panier non trouvé'})};

    //Vérifie si l'article existe déjà dans le panier
    const existingArticle = cart.articlesList.find((article) => article.idArticle === newArticle.idArticle);

    //Ajoutez le nouvel article au tableau d'articles du panier ou met à jour la quantité
    if (existingArticle){
      var newQty = parseInt(existingArticle.quantity) + parseInt(newArticle.quantity)
      if(newQty > 100){
        return res.status(422).json({message: 'La quantité dépasse la limite autorisé !'});
      }else {
        existingArticle.quantity = newQty
      }
    }else{
      cart.articlesList.push(newArticle);
    }

    await cart.save()
    res.json({message: 'Nouvel article ajouté avec succès'});

  }catch(err){
    res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'article' });
  }
})


// Update quantity
router.put('/allCarts/:cart_id/articles/:article_id', authentification, verifyCart, async function(req, res){
  try{
    const cart_id = req.params.cart_id;
    const article_id = req.params.article_id;
    const newQty = req.body.quantity;

    //Recherche le panier à partir de son ID (cart_id)
    const cart = await Cart.findByIdAndUpdate(cart_id);
    if(!cart){return res.status(404).json({message: 'Panier non trouvé'})};

    //Recherche l'article dans le panier à partir de son id (article_id)
    const article = cart.articlesList.id(article_id);
    if(!article){return res.status(404).json({message: 'Article non trouvé'})};

    //Mettre à jour la quantité de l'article
    if(newQty < 1 || newQty > 100){
      return res.status(422).json({message: 'La quantité dépasse la limite autorisé !'});
    }
    //Nouvelle quantité
    article.quantity = newQty;

    await cart.save();
    res.json({message: 'Quantité de l\'article mise à jour avec succès !'});

  } catch(err){
    res.send(err);
  }
});


// Supprimer un article du panier
router.delete('/allCarts/:cart_id/articles/:article_id', authentification, verifyCart, async function(req, res){

  try{
    const cart_id = req.params.cart_id;
    const article_id = req.params.article_id;

    //Recherche le panier à partir de son ID (cart_id)
    const cart = await Cart.findById(cart_id);
    if(!cart){res.status(404).json({message: 'Panier non trouvé'})};

    //console.log(`Panier : ${cart_id}\n`);

    //Recherche l'article dans le panier à partir de son id (article_id)
    const articleIndex = cart.articlesList.findIndex((article) => article._id == article_id);
    //console.log("index article : " + articleIndex);
    if(articleIndex === -1){
      return res.status(404).json({message: 'Article non trouvé'});
    }
    
    //Supprimez l'article du tableau
    cart.articlesList.splice(articleIndex, 1);
    //console.log("Supression réussi");
    
    await cart.save();
    res.json({message: "L'article à été supprimer avec succès !"});

  }catch(err){
    res.send(err);
  }
});


module.exports = router;
