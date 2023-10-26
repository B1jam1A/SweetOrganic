const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Schéma pour les adresses
const addressSchema = new mongoose.Schema({
    adresse : {
        numero: {
            type: Number,
            required: true
        },
        rue: {
            type: String,
            required: true
        },
        ville: {
            type: String,
            required: true
        },
        codePostal: {
            type: String,
            required: true
        },
        pays: {
            type: String,
            required: true
        }
    }   
});


// Schéma principal pour le client
const customerSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
        minlength: 2
    },
    prenom: {
        type: String,
        required: true,
        minlength: 2
    },
    email: {
        type: String,
        required: true,
        minlength: 6,
        unique: true 
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    telephone: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now 
    },
    adresses : [addressSchema],
    // adresses: [{
    //     adresse : {
    //         numero: {
    //     type: Number,
    //     required: true
    // },
    // rue: {
    //     type: String,
    //     required: true
    // },
    // ville: {
    //     type: String,
    //     required: true
    // },
    // codePostal: {
    //     type: String,
    //     required: true
    // },
    // pays: {
    //     type: String,
    //     required: true
    // }
    //     }
    // }],

    authTokens: [{
        authToken: {
            type: String,
            required: true,
        }
    }]
});

//Créer et assigner un token à un utilisateur et l'enregistrer dans la base de données.
customerSchema.methods.generateAuthTokenAndSaveCustomer = async function() {
    const authToken = jwt.sign({_id: this._id.toString()}, process.env.TOKEN_SECRET);
    this.authTokens.push({authToken});
    await this.save();
    return authToken;
}

customerSchema.methods.toJSON = function(){
    const customer = this.toObject();
    delete customer.password;
    delete customer.authTokens;

    return customer;
}

module.exports = mongoose.model('Customer', customerSchema);