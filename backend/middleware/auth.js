const jwt = require('jsonwebtoken'); // importation de jsonwebtoken
 

// création d'un middleware qui vérifiera que le token est valide 
module.exports = (req, res, next) => { // fontion qui sera le middleware
   try {
       const token = req.headers.authorization.split(' ')[1]; // split pour récupération du header et diviser la chaine de caractères en 1 tableau
       const decodedToken = jwt.verify(token, process.env.TOKEN_KEY); // verify pour décoder le token
       const userId = decodedToken.userId;
       req.auth = {
           userId: userId
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};