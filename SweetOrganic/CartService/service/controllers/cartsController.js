const Cart = require ('../models/cartModel');

//Renvoie le prix d'un article
function getArticlePrice(article){
    return article.price * article.quantity;
}
  
//Renvoie le prix total du panier
function getTotalPrice(articlesList){
    var price = 0;
    for(let i=0; i < articlesList.length; i++){
        price += getArticlePrice(articlesList[i]);
    }
    return price;
}

function prepareMsg(cart){
    let message = {
      user_id: cart.user_id,
      articlesList: []
    }
    for(let i=0; i<cart.articlesList.length; i++){
      let simpleArticle = 
      {
          article_name: cart.articlesList[i].name,
          price_id: cart.articlesList[i].price_id,
          quantity: cart.articlesList[i].quantity,
      };
      message.articlesList.push(simpleArticle);
    }
  
    return message;
}
  

// Ajout d'un nouvelle article dans la base de donnée
async function addArticle(article, user_id){
    try{
        const cart = await Cart.find({user_id: user_id});
        
        if(!cart){
            console.log("Panier non trouvé");
            return;
        }
    
        //Vérifie si l'article existe déjà dans le panier
        const existingArticle = cart.articlesList.find((findArticle) => findArticle.idArticle === article.idArticle);
    
        //Ajoutez le nouvel article au tableau d'articles du panier ou met à jour la quantité
        if (existingArticle){
            var newQty = parseInt(existingArticle.quantity) + parseInt(article.quantity)
            if(newQty > 100){
                console.log("Limite d'article atteinte");
                return;
            }else {
                existingArticle.quantity = newQty
            }
        }else{
            cart.articlesList.push(article);
        }
    
        await cart.save();
    }catch(err){
        console.log("Impossible d'ajouter un produit au panier", err);
    }
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

module.exports = {
    getArticlePrice,
    getTotalPrice,
    prepareMsg,
    addArticle,
    isAdmin,
    verifyCart,
}