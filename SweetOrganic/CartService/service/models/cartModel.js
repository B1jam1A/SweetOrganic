const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
    user: String,
    date: String,
    articlesList: [{
        idArticle: String,
        qty: Number
    }]
});

const Cart = mongoose.model("Cart", CartSchema);

module.exports = Cart;