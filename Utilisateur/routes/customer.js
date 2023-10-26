const router = require('express').Router();
const Customer = require('../model/Customer');
const {registerValidationCustomer, loginValidationCustomer} = require('../validationCustomer');
const bcrypt = require('bcryptjs');
const {authentificationCustomer}= require('./verifyToken');


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
        const authToken = await customer.generateAuthTokenAndSaveCustomer();
        res.send({customer});
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
    const authToken = await customer.generateAuthTokenAndSaveCustomer();
    res.send({customer});
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