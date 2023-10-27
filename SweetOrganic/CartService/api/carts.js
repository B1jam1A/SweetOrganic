var express = require('express');
var router = express.Router();
var Cart = require ('../service/models/cartModel');
const {authentification} = require('./verifyToken')

//Renvoie le prix d'un article
function getArticlePrice(article){
  return article.price * article.qty;
}

//Renvoie le prix total du panier
function getTotalPrice(articlesList){
  var price = 0;
  for(let i=0; i < articlesList.length; i++){
    price += getArticlePrice(articlesList[i]);
  }
  return price;
}

//Fonction middleware vérification des droits admin
async function isAdmin(req, res, next) {
  // Vérifiez si l'utilisateur a le rôle "administrateur" ou d'autres autorisations nécessaires.
  if (req.decodedToken.user === 'admin') {
    // L'utilisateur est un administrateur, autorisez l'accès.
    next();
  } else {
    // L'utilisateur n'a pas les autorisations requises, renvoyez une réponse d'erreur.
    res.status(403).json({ message: 'Access Denied!' });
  }
}

//Middleware vérifie si le panier appartient bieen à l'utilisateur
async function verifyCart(req, res, next){
  //Récupère le panier
  const cart_id = req.params.cart_id;

  //Recherchez le panier par son ID (carID)
  const cart = await Cart.findByIdAndUpdate(cart_id);
  if(!cart){return res.status(404).json({message: 'Panier non trouvé'})};

  //Vérifie les paniers
  if (cart.user_id.toString() === req.decodedToken._id) {
    next();
  }
  else {
    res.status(403).json({ message: 'Access Denied!' });
  }
}


/* GET cart page. */
router.get('/', authentification, async function(req, res, next) {
  try{

    //Récupère le panier
    const temp_cart = await Cart.find({ user_id: req.decodedToken._id}); //Tableau panier 
    var cart = temp_cart[0];

    //Regarde si le tableau est vide
    if(cart === 0){
      let new_cart = new Cart();
      new_cart.user_id = req.decodedToken._id;
      cart = new_cart;
      await cart.save();
    }

    //Récupère les articles
    const articlesList = cart.articlesList;

    //Affiche la page panier avec les articles
    res.render('carts', { title: 'Mon panier', articlesList, getArticlePrice, getTotalPrice});
  
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
      qty: req.body.qty,
      price: req.body.price,
    };

    //Recherchez le panier par son ID (carID)
    const cart = await Cart.findByIdAndUpdate(cart_id);
    if(!cart){return res.status(404).json({message: 'Panier non trouvé'})};

    //Vérifie si l'article existe déjà dans le panier
    const existingArticle = cart.articlesList.find((article) => article.idArticle === newArticle.idArticle);

    //Ajoutez le nouvel article au tableau d'articles du panier ou met à jour la quantité
    if (existingArticle){
      var newQty = parseInt(existingArticle.qty) + parseInt(newArticle.qty)
      if(newQty > 100){
        return res.status(422).json({message: 'La quantité dépasse la limite autorisé !'});
      }else {
        existingArticle.qty = newQty
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
    const newQty = req.body.qty;

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
    article.qty = newQty;

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
