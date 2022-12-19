const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const multer = require ('../middleware/multer-config')


const sauceCtrl = require('../controllers/sauce');

//Route pour créer une sauce
router.post('/', auth, multer, sauceCtrl.createSauce); // placer auth avant le gestionnaire de route
  
// Route pour trouver une sauce par son identifiant
router.get('/:id', auth, sauceCtrl.getOneSauce); 
  
// Route pour récupérer la liste de sauces
router.get('/', auth, sauceCtrl.getAllSauces);
  
//Route pour modifier la sauce existante
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
  
//Route pour supprimer la sauce
router.delete('/:id', auth, sauceCtrl.deleteSauce);

//Route pour ajouter un like ou dislike
router.post('/:id/like', auth, sauceCtrl.addlikedislike); 

module.exports = router;