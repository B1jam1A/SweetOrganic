// Créez un price_id pour un produit
async function createPrice(product){
    return await stripe.prices.create({
        unit_amount: product.unit_amount,
        currency: 'eur',
        product: product._id,
    });
}

// Créez une liste d'item avec leurs price_id et la quantité
/*async function createLineItem(cart){
    var line_items = []
    for(let i = 0; i < cart.articlesList.length; i++){
        var article = cart.articlesList[i];
        line_items.push(
            {
                price: article.price_id,
                quantity: article.qty,
            }
        );
    }
    return line_items;
}*/


function createLineItem(cartData){
    console.log("Traiement des items en cours ...");
    var line_items = []
    console.log(`Longueur de cartData ${cartData.length}`);
    for(let i = 0; i < cartData.length; i++){
        let article = cartData[i];
        console.log(`Article ${i} : ${article}`);
        line_items.push(
            {
                price: article.price_id,
                quantity: article.quantity,
            }
        );
    }
    console.log("///// list items /////");
    console.log(line_items);
    return line_items;
}


module.exports = {
    createPrice,
    createLineItem,
}