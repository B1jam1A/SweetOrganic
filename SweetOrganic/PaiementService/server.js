//Get the packages we need
var express = require('express');
//var mongoose = require('mongoose');
var bodyParser = require('body-parser');
//var amqp = require('amqplib/callback_api');
//const connectToDb = require('./config/paymentDB');
//const connectToMsgBroker = require('./config/consumer')

//Connect to the beerlocker MongoDB
//mongoose.connect(MONGODB_URL); 
//connectToDb();
//connectToMsgBroker();


//Create our Express application
var app = express(); 

app.use(bodyParser.urlencoded({
    extended: true
}));

//Use environment defined port or 3000
var port = process.nextTick.PORT || 3000;

//Create our Express router
var router = require('./api/payment');

//Register all our routes with /api
app.use('/api', router);

//Start the server
app.listen(port);
console.log('Listen on port ' + port);

