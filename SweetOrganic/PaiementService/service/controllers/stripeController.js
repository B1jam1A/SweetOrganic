const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


// Créez un product sur Stripe
async function createProduct(product) {
    try{
        return await stripe.products.create({
            id: product.idProduit,
            name: product.nom,
        });
    }catch(err){
        console.log(err);
    }
}


// Créez un price_id pour un produit
async function createPrice(product) {
    const createdProduct = await createProduct(product);
    const unit_amount = Math.round(product.prix * 100);

    try{
        return await stripe.prices.create({
            unit_amount: unit_amount,
            currency: 'eur',
            product: createdProduct.id,
        });
    }catch(err){
        console.log(err);
    }

}

//Créer le tableau d'item pour stripe
function createLineItem(cartData){
    var line_items = []
    for(let i = 0; i < cartData.length; i++){
        let article = cartData[i];
        line_items.push(
            {
                price: article.price_id,
                quantity: article.quantity,
            }
        );
    }
    return line_items;
}


module.exports = {
    createPrice,
    createLineItem,
}