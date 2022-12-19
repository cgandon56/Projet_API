const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); // ajout du valdateur comme plugin au schéma 

// Création du schéma qui va permettre de ne pas avoir plusieurs utlisateurs avec la même adresse

const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},// impossibilité de s'inscrire plusieurs fois avec la même adresse mail
    password: {type: String, required: true}
});

userSchema.plugin(uniqueValidator);// application du validateur au schéma


module.exports = mongoose.model('User', userSchema);


