const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');



// Schéma principal pour le client
const adminSchema = new mongoose.Schema({
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
    
    authTokens: [{
        authToken: {
            type: String,
            required: true,
        }
    }]
});

//Créer et assigner un token à un utilisateur et l'enregistrer dans la base de données.
adminSchema.methods.generateAuthTokenAndSaveAdmin = async function() {
    const authToken = jwt.sign({_id: this._id.toString()}, process.env.TOKEN_SECRET);
    this.authTokens.push({authToken});
    await this.save();
    return authToken;
}

adminSchema.methods.toJSON = function(){
    const admin = this.toObject();
    delete admin.password;
    delete admin.authTokens;
    delete admin.permissions;

    return admin;
}

module.exports = mongoose.model('Admin', adminSchema);