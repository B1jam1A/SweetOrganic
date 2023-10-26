const Cart = require ('./cartsModel');

const getCart = async( _req, res) =>{
    const carts = await Cart.find();
    res.send (carts);
}

const updateCart = async (req, res) => {
    const update_cart = await Cart.findOneAndUpdate(req.params.id, req.body);
    res.send( update_cart );
}

module.exports = {
    getCart,
    updateCart
}