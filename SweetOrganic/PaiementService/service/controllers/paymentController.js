const Payment = require ('../models/paymentModel');

//Les transactions d'un utilisateur
async function getTransactionsByUser(user_id){
    const transactions = await Payment.find({user_id: user_id});
    return transactions;
}

//Une seul transaction par son id
async function getTransactionById(transaction_id){
    const transaction = await Payment.findById({_id: transaction_id});
    return transaction;
}

async function createPriceIdMessage(idProduit, price_id){
    return {
        idProduit: idProduit,
        price_id: price_id
    }
}

module.exports = {
    getTransactionsByUser,
    getTransactionById,
    createPriceIdMessage,
}