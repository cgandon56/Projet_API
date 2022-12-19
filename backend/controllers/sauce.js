const fs = require('fs');
const Sauce = require('../models/Sauce')


//Logiques pour chaque fonction

//Fonction pour créer une sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id; 
    delete sauceObject._userId; // Mesure de sécurité : suppression de l'user ID pour éviter que qq créé une sauce à son nom
    const sauce = new Sauce({ // création de la sauce
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // générer l'image
    });

    sauce.save() // enregistrer la sauce dans la base de données
    .then(() =>{res.status(201).json({message: 'Objet enregistré'})})
    .catch(error => {res.status(400).json({error})})
  };

  //Fonction pour modifier une sauce
  exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {// si il y a un fichier
        ...JSON.parse(req.body.sauce), // Récupération de la sauce
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        

    } : // si pas de fichier nous récupérons l'objet directement
    { ...req.body };
  
    delete sauceObject._userId; 

    Sauce.findOne({_id: req.params.id})// Récupération de la sauce en base de données
        .then((sauce) => {
          if (req.file){
            const filename = sauce.imageUrl.split('/images/')[1]// Si une image est modifiée, supprimer la 1ere
           fs.unlinkSync(`images/${filename}`)
          }
            if (sauce.userId != req.auth.userId) { // Si la sauce n'appartient pas à l'utilisateur il n'est pas autorisé
                res.status(401).json({ message : 'Non autorisé'});
            } else {
                Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})// Sinon mise à jour de la sauce 
                .then(() => res.status(200).json({message : 'Objet modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
 };


//Fonction pour supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
      .then(sauce => {
          if (sauce.userId != req.auth.userId) { // si l'utilisateur n'est pas celui qui a créé la sauce
              res.status(401).json({message: 'Non autorisé'});
          } else {
              const filename = sauce.imageUrl.split('/images/')[1]; // sinon supprimer la 1ere image du dossier
              fs.unlink(`images/${filename}`, () => {
                  Sauce.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {res.status(500).json({ error });});
};




// Fonction pour récupérer une liste de sauces
  exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
  };

  //Fonction pour récupérer une sauce
  exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id:req.params.id})
    .then(Sauce => res.status(200).json(Sauce))
    .catch(error => res.status(404).json({error}));
  };




  // Fonction pour ajouter un like ou dislike
//  Si like = 1, l'utilisateur aime (= like) la sauce. Si like = 0, l'utilisateur annule son like ou son dislike. Si like = -1, l'utilisateur n'aime pas (= dislike) la sauce

exports.addlikedislike = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
      if (req.body.like === 1) { 
        // Si like = 1, l'utilisateur aime (= like) la sauce
        Sauce.updateOne({ _id: req.params.id }, {
          $inc: { likes: (req.body.like++) }, // ajout d'1 like
          $push: { usersLiked: req.body.userId } // push du like
          })
          .then(() => res.status(200).json({ message: 'Like ajouté !' }))
          .catch(error => res.status(400).json({ error }));
      } 
      if (req.body.like === -1) { 
        // Si like = -1, l'utilisateur n'aime pas (= dislike) la sauce
        Sauce.updateOne({ _id: req.params.id }, { 
          $inc: { dislikes: (req.body.like++) *  -1 }, 
          $push: { usersDisliked: req.body.userId } 
        }) 
          .then(() => res.status(200).json({ message: 'Dislike ajouté !' }))
          .catch(error => res.status(400).json({ error }));
      } else {  
    // si l'utilisateur annule son like ou dislike
        if (sauce.usersLiked.includes(req.body.userId)) { 
          Sauce.updateOne({ _id: req.params.id }, { 
            $pull: { usersLiked: req.body.userId }, 
            $inc: { likes: -1 } })
              .then(() => { res.status(200).json({ message: 'Like supprimé !' }) 
            })
              .catch(error => res.status(400).json({ error }))
        } else if (sauce.usersDisliked.includes(req.body.userId)) {
            Sauce.updateOne({ _id: req.params.id }, { 
              $pull: { usersDisliked: req.body.userId }, 
              $inc: { dislikes: -1 } 
            })
              .then(() => { res.status(200).json({ message: 'Dislike supprimé !' }) })
              .catch(error => res.status(400).json({ error }))
        }
      }})
      .catch(error => res.status(400).json({ error }));
  };


