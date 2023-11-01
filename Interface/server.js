const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 4000;

// Middleware pour analyser le contenu des requêtes POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Utiliser EJS comme moteur de rendu
app.set('view engine', 'ejs');

// Route pour la page de connexion
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const response = await axios.post('http://localhost:3000/api/user/customer/login', {
            email,
            password
        });

        // Stockez le token d'accès dans un cookie si présent
        if (response.data && response.data.authToken) {
            res.cookie('authToken', response.data.authToken, { httpOnly: true });
        }

        console.log(response.data);
        res.redirect('/profile');
    } catch (error) {
        console.error('Erreur de connexion:', error.response ? error.response.data : error.message);
        res.send("Erreur lors de la connexion. Voir la console pour les détails.");
    }
});

app.get('/display-token', (req, res) => {
    res.send(`Votre token est: ${req.cookies.authToken}`);
});

app.get('/profile', async (req, res) => {
    const token = req.cookies.authToken;

    if (!token) {
        return res.send("Veuillez vous connecter pour accéder à cette page.");
    }

    try {
        const headers = {
            'Authorization': `Bearer ${token}`
        };
        
        const response = await axios.get('http://localhost:3000/api/user/customer/me', { headers });
        
        if (response.data) {
            res.render('profile', response.data);
        } else {
            res.send("Erreur lors de la récupération des données du profil.");
        }
    } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error.response ? error.response.data : error.message);
        res.send("Erreur lors de la récupération du profil. Voir la console pour les détails.");
    }
});


app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
