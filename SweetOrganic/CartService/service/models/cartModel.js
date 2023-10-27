const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
    user_id: String,
    date: String,
    articlesList: [{
        idArticle: String,
        qty: Number,
        price: Number
    }]
});

const Cart = mongoose.model("Cart", CartSchema);

module.exports = Cart;