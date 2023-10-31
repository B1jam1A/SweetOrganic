const Payment = require ('./paymentModel');

const getPayment = async (req,res) => {
    const payment = await Payment.findById(req.params.id);
    res.send(payment);
}

const getUserPayment = async (req,res) => {
    const payment = await Payment.find(req.params.user_id);
    res.send(payment);
}