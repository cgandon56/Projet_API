const passwordValidator = require('password-validator');

//Schema pour valider le mot de passe

const passwordSchema = new passwordValidator();
passwordSchema
.is().min(8)                                    // Minimum  8 caractères
.is().max(100)                                  // Maximum 100
.has().uppercase()                              // au moins 1 majuscule
.has().lowercase()                              // au moins 1 minuscsule
.has().digits()                                // au moins 1 chiffre
.has().not().spaces()                           // sans espace
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist 

module.exports = passwordSchema;

// vérifie que le mot de passe valide le schema décrit

module.exports = (req, res, next) => {
    if (passwordSchema.validate(req.body.password)) { // si mot de passe valide
        next();
    } else {
        return res.status(400).json({error : " Le mot de passe doit contenir :"+ passwordSchema.validate(req.body.password, {list:true})})
           }
};




