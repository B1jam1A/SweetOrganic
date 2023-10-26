const mongoose = require("mongoose");

const CartLigneSchema = new mongoose.Schema({
    codeArticle: String,
    qtyArtcicle: Number,
    priceArticle: Number
});

const CartLigne = mongoose.model("CartLigne", CartLigneSchema);

module.exports = CartLigne;

/*module.exports = class Article{
    constructor(code, qty, price){
        this.code = code;
        this.qty = qty;
        this.price = price;
    }
}*/


