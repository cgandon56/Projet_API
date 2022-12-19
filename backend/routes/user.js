const express = require('express');
const router = express.Router();
const password = require('../models/password'); // associer le password aux routes
const userCtrl = require('../controllers/user');// associer les fonctions aux routes

// création des routes post pour envoyer adresse mail et mot de passe
router.post('/signup', password, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;