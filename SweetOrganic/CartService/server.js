//Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Cart = require('./service/models/cartModel');
var amqp = require('amqplib/callback_api');
const connectToDb = require('./config/cartsDB');
const connectToMsgBroker = require('./config/consumer')
var path = require('path');
var logger = require('morgan');
const session = require('express-session');

//Use environment defined port or 3000
var port = process.nextTick.PORT || 3000;

//Connect to the beerlocker MongoDB
//mongoose.connect(MONGODB_URL); 
connectToDb();
connectToMsgBroker();

//Create our Express application
var app = express(); 

//Session utilisateur
app.use(session({
    secret: 'votre_clé_secrète',
    resave: false,
    saveUninitialized: false
  }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
    extended: true
}));

//Create our Express router
var router = require('./api/carts');

// Middleware pour vérifier l'état de l'utilisateur
function checkUserLoggedIn(req, res, next) {
    if (req.session.userId) {
        // L'utilisateur est connecté, passez à la suite
        next();
    } else {
        // L'utilisateur n'est pas connecté, redirigez-le vers une page de connexion
        //res.redirect('/connexion'); // Personnalisez l'URL de connexion

        res.json({message: "Vous n'êtes connecté"});
    }
}

//Register all our routes with /api
app.use('/Cart', router);

//Start the server
app.listen(port);
console.log('Listen on port ' + port);

