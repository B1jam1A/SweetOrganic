const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
    user_id: String,
    date: String,
    articlesList: [{
        idArticle: String,
        name: String,
        quantity: Number,
        price: Number,
        price_id: String
    }]
});

const Cart = mongoose.model("Cart", CartSchema);

module.exports = Cart;