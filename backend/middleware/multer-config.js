const multer = require('multer');


// création d'un middleware de gestion de fichiers
const MIME_TYPES = { //dictionnaire
    'image/jpg' : 'jpg',
    'image/jpeg' : 'jpg',
    'image/png': 'png'
};

//création d'un objet de configuration pour multer
const storage = multer.diskStorage({ // fonction d'enregistrement sur le disque qui a besoin de 2 éléments
    destination: (req, file, callback) => { // dossier images pour enregistrer le fichier
        callback(null, 'images')
    },
    filename: (req, file, callback) => { //quel nom de fichier utilisé
        const name = file.originalname.split('').join('');
        const extension = MIME_TYPES[file.mimetype]; // extension du fichier
        callback(null, name + Date.now() + '.' + extension); // appel du callback
    }
});

module.exports = multer({ storage}).single('image');