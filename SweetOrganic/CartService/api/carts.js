var express = require('express');
var router = express.Router();
var Cart = require ('../service/models/cartModel');

const panier = [
  { id: 1, nom: 'Article 1', prix: 10.99 },
  { id: 2, nom: 'Article 2', prix: 5.99 },
  // Ajoutez plus d'articles au panier
];
const idpanier = '653b60650da6fe35c02fd5f1';

function getArticlePrice(article){
  return article.price * article.qty;
}

function getTotalPrice(articlesList){
  var price = 0;
  for(let i=0; i < articlesList.length; i++){
    price += getArticlePrice(articlesList[i]);
  }
  return price;
}

/* GET cart page. */
router.get('/', async function(req, res, next) {
  try{
    //Récupère le panier
    const cart = await Cart.findById(idpanier);
    //Récupère les articles
    const articlesList = cart.articlesList;
    //Affiche la page panier avec les articles

    res.render('carts', { title: 'Mon panier', articlesList, getArticlePrice, getTotalPrice});
  }catch(err){
    res.json(err);
  }
});


/*router.get('/', function(req, res) {
  res.json({message: 'Votre panier est vide !'});
});*/

var cartsRoute = router.route('/carts');

// Create endpoint for POSTS
cartsRoute.post(async function(req, res){

  //TODO: Ajouter une condition pour les utilisateurs déjà inscrit.
  //Lorsqu'un nouveau utilisateur créer son compte, un panier lui est attribué.
  //Pour mainteir les performances du database:
  //  - il serait préférable de supprimer les paniers vides de la base lorsqu'un utilisateur quitte la session.
  //  - de créer un nouveau panier pour utilisateur qui non pas de panier lorsqu'il se connecte

  //Create a new instance of cart model

  var cart = new Cart();

  //Set the cart properties that came from the POST data
  cart.user = req.body.user;
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



// Create endpoint /api/carts for GET
cartsRoute.get(function(req, res){
  Cart.find().then(carts=>res.json(carts)).catch(err=>res.send(err));
});

// Get a cart
var cartRoute = router.route('/carts/:cart_id');
cartRoute.get(async function(req, res){
  Cart.findById(req.params.cart_id).then(cart=>res.json(cart)).catch(err=>res.send(err));
});

var addArticleRoute = router.route('/carts/:cart_id/articles');

// Ajouter un article au panier
addArticleRoute.post(async function(req, res){
  try{
    //Identifiant du panier
    const cart_id = req.params.cart_id;
    //Nouvelle article
    const newArticle = {
      idArticle: req.body.idArticle,
      qty: req.body.qty
    };

    //Recherchez le panier par son ID (carID)
    const cart = await Cart.findByIdAndUpdate(cart_id);
    if(!cart){return res.status(404).json({message: 'Panier non trouvé'})};

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

    //addArticleRoute.render()

  }catch(err){
    res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'article' });
  }
})

var articleRoute = router.route('/carts/:cart_id/articles/:article_id');

// Update quantity
articleRoute.put(async function(req, res){
  try{
    const cart_id = req.params.cart_id;
    const article_id = req.params.article_id;
    const newQty = req.body.qty;

    //console.log("Recherche de l'article !\n");

    //Recherche le panier à partir de son ID (cart_id)
    const cart = await Cart.findByIdAndUpdate(cart_id);
    if(!cart){return res.status(404).json({message: 'Panier non trouvé'})};

    //console.log(`Panier : ${cart_id}\n`);

    //Recherche l'article dans le panier à partir de son id (article_id)
    const article = cart.articlesList.id(article_id);
    if(!article){return res.status(404).json({message: 'Article non trouvé'})};

    //console.log(`Article : ${article_id}\n`);

    //Mettre à jour la quantité de l'article
    if(newQty < 1 || newQty > 100){
      return res.status(422).json({message: 'La quantité dépasse la limite autorisé !'});
    }
    article.qty = newQty;
    //console.log(`Quantité : ${article.qty}\n`);

    await cart.save();
    res.json({message: 'Quantité de l\'article mise à jour avec succès !'});

  } catch(err){
    res.send(err);
  }
});

//var articleRoute = router.route('/carts/:cart_id/articles/:article_id');


// Supprimer un article du panier

articleRoute.delete(async function(req, res){

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
