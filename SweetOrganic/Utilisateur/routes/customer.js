const router = require('express').Router();
const Customer = require('../model/Customer');
const {registerValidationCustomer, loginValidationCustomer} = require('../validationCustomer');
const bcrypt = require('bcryptjs');
const {authentificationCustomer}= require('./verifyToken');
const amqp = require('amqplib');


let lastReceivedMessage = null;
async function connectToMQ() {
    try {
        const connection = await amqp.connect(process.env.MQ_CONNECT);
        const channel = await connection.createChannel();
        
        const queue = 'jobs';
        await channel.assertQueue(queue);

        // Écoute des messages
        channel.consume(queue, message => {
            const messageContent = message.content.toString();
            try {
                const jsonMessage = JSON.parse(messageContent);
                console.log("Received JSON Message:", jsonMessage);

                // Stocker le dernier message reçu
                lastReceivedMessage = jsonMessage;

            } catch (parseError) {
                console.error("Failed to parse JSON:", parseError);
            }

            // Acknowledge the message
            channel.ack(message);

        }, { noAck: false });

        console.log("Waiting for messages...");

    } catch (error) {
        console.log(error);
    }
}
connectToMQ(); 


async function createCartToMQ(idCustumer) {
    try {
        const connection = await amqp.connect(process.env.MQ_CONNECT);
        const channel = await connection.createChannel();

        const queue = 'creerPanier';

        // // Exemple de message JSON
        // const message = {
        //     msg: "Un message a été envoyé depuis le MS Produit",
        //     timestamp: new Date().toISOString(),
        //     // Ajoutez d'autres propriétés ici si nécessaire
        // };

        // Convertir l'objet JSON en chaîne et ensuite en buffer
        const messageBuffer = Buffer.from(idCustumer);

        await channel.assertQueue(queue, { durable: true });
        channel.sendToQueue(queue, messageBuffer);

        console.log("Message sent:", idCustumer);

    } catch (error) {
        console.log(error);
    }
}


//S'inscrire
router.post('/register', async (req, res) => {

    const {error} = registerValidationCustomer(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Vérifier que l'utilisateur est déjà dans la base de données
    const emailExist = await Customer.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send("Email already exists");

    //Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);


    //Creer un nouvel utilisateur
    const customer = new Customer({
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        password: hashPassword,
        telephone: req.body.telephone,
        adresses: req.body.adresses
    });
    try{
        const result = await customer.generateAuthTokenAndSaveCustomer();
        createCartToMQ(result.customerId);
        res.send({customer, authToken: result.authToken});
    }catch(err){
        res.status(400).send(err);

    }
});

//Se connecter
router.post('/login', async (req, res) => {
    const {error} = loginValidationCustomer(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Vérifier que l'utilisateur est déjà dans la base de données
    const customer = await Customer.findOne({email: req.body.email});
    if(!customer) return res.status(400).send("Email is not found");

    //Les indentifiants sont correctes
    const validPass = await bcrypt.compare(req.body.password, customer.password);
    if(!validPass) return res.status(400).send('Invalid password');

    //Créer et assigner un token
    const result = await customer.generateAuthTokenAndSaveCustomer();
    res.send({customer, authToken: result.authToken});
})


//Deconnexion
router.post('/logout', authentificationCustomer, async (req, res) => {
    try {
        req.customer.authTokens = req.customer.authTokens.filter((authToken) => {
            //Renvoyer tout les tokens sauf celui qui est entrain d'être utiliser
            return authToken.authToken !== req.authToken;
        });

        await req.customer.save();
        res.send("Logout on this device");
    }catch(err){
        res.status(500).send();
    }
});

//Deconnexion (Tout)
router.post('/logout/all', authentificationCustomer, async (req, res) => {
    try {
        //Supprime tout les tokens
        req.customer.authTokens = [];
        await req.customer.save();
        res.send("Logout on all devices");
    }catch(err){
        res.status(500).send();
    }
});



//Profil Client
router.get('/me', authentificationCustomer, async(req, res, next) =>{
    res.send(req.customer);
});




router.put('/me', authentificationCustomer, async (req, res) => {
    const customerId = req.customer.id

    // Récupérer le client actuel de la base de données
    const currentCustomer = await Customer.findById(customerId);
    if(!currentCustomer) return res.status(404).send('Customer not found!');

    // Fusionner avec les données du req.body
    const updatedData = { ...currentCustomer.toObject(), ...req.body };

    // Valider les informations avec registerValidationCustomer
    const {error} = registerValidationCustomer(updatedData);
    if(error) return res.status(400).send(error.details[0].message);

    // Vérifier que l'e-mail n'est pas déjà utilisé par un autre utilisateur
    const emailExist = await Customer.findOne({ email: updatedData.email, _id: { $ne: customerId } });
    if(emailExist) return res.status(400).send("Email already exists with another account");

    // Si un nouveau mot de passe est fourni, alors le hacher
    if(req.body.password) {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        updatedData.password = hashPassword;
    }

    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(customerId, updatedData, { new: true });
        res.send(updatedCustomer);
    } catch(err) {
        res.status(400).send(err);
    }
});


module.exports = router;