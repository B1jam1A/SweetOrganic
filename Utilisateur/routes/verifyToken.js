const jwt = require('jsonwebtoken');
const Customer = require('../model/Customer');
const Admin = require('../model/Admin');

const authentificationCustomer = async(req, res, next) =>{
    try{
        const authToken = req.header('Authorization').replace('Bearer ', '');
        //Décode et vérifie le token
        const decodedToken = jwt.verify(authToken, process.env.TOKEN_SECRET);
        //Cherche le tocken dans le tableau de tokens enregistré dans la base de données
        const customer = await Customer.findOne({_id: decodedToken._id, 'authTokens.authToken': authToken});
        
        if(!customer){
            throw new Error();
        };
        req.customer = customer;
        req.authToken = authToken;
        next();
    }catch(err){
        res.status(400).send("Access Denied!");
    }
};

const authentificationAdmin = async(req, res, next) =>{
    try{
        const authToken = req.header('Authorization').replace('Bearer ', '');
        //Décode et vérifie le token
        const decodedToken = jwt.verify(authToken, process.env.TOKEN_SECRET);
        //Cherche le tocken dans le tableau de tokens enregistré dans la base de données
        const admin = await Admin.findOne({_id: decodedToken._id, 'authTokens.authToken': authToken});
        
        if(!admin){
            throw new Error();
        };
        req.admin = admin;
        req.authToken = authToken;
        next();
    }catch(err){
        res.status(400).send("Access Denied!");
    }
};


module.exports.authentificationCustomer = authentificationCustomer;
module.exports.authentificationAdmin = authentificationAdmin;