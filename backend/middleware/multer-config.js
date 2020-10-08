const multer = require('multer');// on importe multer

const MIME_TYPES = {// les extensions utiliser pour nos fichiers
    'image/jpg': 'jpg', // jpg ne change pas
    'image/jpeg': 'jpg',// on transforme jpeg en jpg
    'image/png': 'png'// png ne change pas
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {// on lui donne la destination où va être stocké notre image
        callback(null, 'images');// null pour dire qu'il y a pas eu d'erreur et images est le nom du dossier
    },
    filename:  (req, file, callback) => {//ici on explique le nom que l'on va utiliser pour notre image
        const name = file.originalname.split(' ').join('_');// originalname permet de garder le nom d'origine du fichier mais pour éviter d'avoir des erreur on va supprimer ces espaces et les remplacer par des underscores.
        const extension = MIME_TYPES[file.mimetype];// on créé l'extension de notre fichier qui correspond au mimetype du fichier envoyé par le frontend
        callback(null, name + Date.now() + '.' + extension);// on appelle le callback. On met en première argument null comme au dessus, en deuxième argument le name au dessus avec un timestamp Date.now() pour le rendre unique aux autres noms d'images qui seront ajouté puis un '.' et l'extension.
    }
});

module.exports = multer({storage: storage}).single('image');// on appelle notre fonction multer en lui donne notre objet storage et single pour dire que c'est un fichier unique et non pas un groupe de fichier 