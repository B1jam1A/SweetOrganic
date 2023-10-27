const jwt = require('jsonwebtoken');


const authentification = async(req, res, next) =>{
    try{
        const authToken = req.header('Authorization').replace('Bearer ', '');
        //Décode et vérifie le token
        const decodedToken = jwt.verify(authToken, process.env.TOKEN_SECRET);


        console.log(decodedToken);

        next();
    }catch(err){
        res.status(400).send("Access Denied!");
    }
};

module.exports.authentification = authentification;