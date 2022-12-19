const mongoose = require('mongoose'); //Importation de mongoose 
const express = require('express'); // Importation d'express
const dotenv = require("dotenv");
const app = express(); // création de l'application express
const sauceRoutes = require ('./routes/sauce');
const userRoutes = require ('./routes/user');
const path = require('path'); // accéder au path du serveur

dotenv.config();


// Pour permettre le connection à mongoose 
mongoose.connect(process.env.mongoose_connection,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

 
// Middleware

app.use(express.json());// Middleware qui intercepte le contenu qui contient du json et met à disposition ce contenu

app.use((req, res, next) => {// Middleware qui sera appliqué à toutes les routes pour permettre à l'application d'accéder à l'API sans problème (CORS)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();// passer l'éxécution au middleware d'après
});

app.use('/api/sauces', sauceRoutes); // enregistrer les routes sauces
app.use('/api/auth', userRoutes); // enregistrer les routes utilisateurs
app.use('/images', express.static(path.join(__dirname, 'images'))); // enregistrer une route pour images


module.exports = app; //exportation de l'application