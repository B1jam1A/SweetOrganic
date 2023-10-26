const router = require('express').Router();
const Admin = require('../model/Admin');
const Customer = require('../model/Customer');
const {loginValidationAdmin} = require('../validationAdmin');
const {registerValidationCustomer} = require('../validationCustomer');
const bcrypt = require('bcryptjs');
const {authentificationAdmin} = require('./verifyToken');



//Se connecter
router.post('/login', async (req, res) => {
    console.log(req.body);
    const {error} = loginValidationAdmin(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Vérifier que l'utilisateur est déjà dans la base de données
    const admin = await Admin.findOne({email: req.body.email});
    console.log(admin.password);
    if(!admin) return res.status(400).send("Email is not found");

    //Les indentifiants sont correctes
    const validPass = await bcrypt.compare(req.body.password, admin.password);
    if(!validPass) return res.status(400).send('Invalid password');

    //Créer et assigner un token
    const authToken = await admin.generateAuthTokenAndSaveAdmin();
    res.send({admin});
})


//Deconnexion
router.post('/logout', authentificationAdmin, async (req, res) => {
    try {
        req.admin.authTokens = req.admin.authTokens.filter((authToken) => {
            //Renvoyer tout les tokens sauf celui qui est entrain d'être utiliser
            return authToken.authToken !== req.authToken;
        });

        await req.admin.save();
        res.send("Logout on this device");
    }catch(err){
        res.status(500).send();
    }
});

//Deconnexion (Tout)
router.post('/logout/all', authentificationAdmin, async (req, res) => {
    try {
        //Supprime tout les tokens
        req.admin.authTokens = [];
        await req.admin.save();
        res.send("Logout on all devices");
    }catch(err){
        res.status(500).send();
    }
});

//Supprimer Client
router.delete('/customer/:id', authentificationAdmin, async (req, res) => {
    const customerId = req.params.id;
    try{
        const customer = await Customer.findByIdAndDelete(customerId);
        if(!customer) return res.status(404).send('User not found!');
        res.send("Customer removed from the database!");
    }catch(err){
        res.status(500).send("An error occurred while deleting the customer.")
    }
});

// Consulter tous les Clients
router.get('/customer/all', authentificationAdmin, async (req, res) => {
    try{
        const customers = await Customer.find();  // récupérer tous les clients
        res.send(customers);  // renvoyer la liste de tous les clients
    }catch(err){
        res.status(500).send("An error occurred while fetching the customers.");
    }
});

// Consulter tous les Clients
router.get('/customer/:id', authentificationAdmin, async (req, res) => {
    const customerId = req.params.id;
    try{
        const customer = await Customer.findById(customerId);  // récupérer tous les clients
        res.send(customer);  // renvoyer la liste de tous les clients
    }catch(err){
        res.status(500).send("An error occurred while fetching the customer.");
    }
});
// Ajouter Client
router.post('/customer/register', authentificationAdmin, async (req, res) => {

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

// Modifier Client
router.put('/customer/:id', authentificationAdmin, async (req, res) => {
    
    const customerId = req.params.id;
    console.log(customerId);

    let updatedData = { ...req.body };
    
    // Si un nouveau mot de passe est fourni, alors le hacher
    if(req.body.password) {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        updatedData.password = hashPassword;
    }

    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(customerId, updatedData, { new: true });
        
        if (!updatedCustomer) {
            return res.status(404).send('Customer not found!');
        }
        
        res.send(updatedCustomer);
    } catch(err) {
        res.status(400).send(err);
    }
});



module.exports = router;