const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        requiered: true,
    },
    status: String,
    payment_date:{
        type: Date,
        default: Date.now,
    },
    intent_id: String,
});

const Payment = mongoose.model("Payment", PaymentSchema);

module.exports = Payment;