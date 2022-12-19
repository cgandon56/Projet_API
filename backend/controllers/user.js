const bcrypt = require('bcrypt'); //importation du package bcrypt
const jwt = require('jsonwebtoken'); //importation du package qui permet de créer des token et de les vérifier

const User = require('../models/User');

// Fonction pour enregistrement de nouveaux utilisateurs
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) // fonction pour hacher le mot de passe 
      .then(hash => { // récupération du hash du mot de passe
        const user = new User({ // utilisateur créé dans la base de données
          email: req.body.email,
          password: hash
        });
        user.save() // utilisateur enregistré dans la base de données
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };

  // Fonction pour la connection des utilisateurs existants avec vérification des mots de passe
  exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) 
        .then((user) => {
            if (!user) { //si l'utilisateur n'existe pas dans la base de données
                return res.status(401).json({ error: 'Paire login/mot de passe incorrect'});
            }
            bcrypt.compare(req.body.password, user.password)// si il existe, comparaison mot de passe donné et mot de passe transmis
                .then(valid => {
                    if (!valid) { // si mot de passe non valide
                        return res.status(401).json({ error: 'Paire login/mot de passe incorrect' });
                    }
                    res.status(200).json({ // si mot de passe correct
                      userId: user._id,
                      token: jwt.sign( // fonction sign qui prend 3 arguments
                          { userId: user._id },
                          process.env.TOKEN_KEY,
                          { expiresIn: '24h' } 
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };