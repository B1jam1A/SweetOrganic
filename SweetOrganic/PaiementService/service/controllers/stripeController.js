// Créez un price_id pour un produit
async function createPrice(product){
    const unit_amount = Math.round((product.prix * 100));
    return await stripe.prices.create({
        unit_amount: unit_amount,
        currency: 'eur',
        product: product.idProduit,
    });
}

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