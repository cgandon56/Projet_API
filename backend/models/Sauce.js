const mongoose = require('mongoose'); //Importation de mongoose

// Création du Schéma de données avec la fonction schéma (champs dont notre schéma aura besoin)

const SauceSchema = mongoose.Schema({
  userId : { type: String, required: true },
  name : { type: String, required: true },
  manufacturer : { type: String, required: true },
  description : { type: String, required: true },
  mainPepper  : { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes : { type: Number,  default: 0  },
  dislikes : { type: Number, default: 0  },
  usersLiked: { type: [String], required: false },
  usersDisliked : { type: [String], required: false },
});






module.exports = mongoose.model('Sauce', SauceSchema);