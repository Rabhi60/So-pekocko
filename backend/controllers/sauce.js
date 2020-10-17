const Sauce = require('../models/Sauce');// on importe notre schéma Sauce 
const fs = require('fs');// on importe file system de node pour avoir accès aux différentes opérations liées fichiers
const nameRegex = /^[a-zÀ-ÿ\d\-.'\s]{3,50}$/i;// regex pour les caratères autorisé
const descriptionRegex = /^[a-zÀ-ÿ\d\-,.'\s]{3,200}$/i;// regex pour les caratères autorisé

// la logique métier
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);// on transforme notre requête en objet JavaScript
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`,//on donne une URL a notre image. http://localhost:3000/images/<image-name>.jpg = req.protocol pour obtenir le premier segment (dans notre cas 'http'), on ajoute '://' , puis utilisons req.get('host') pour résoudre l'hôte du serveur (ici, 'localhost:3000' ), on ajoute '/images/' et le nom de fichier pour compléter notre URL (req.file.filename ne contient que le segment filename).
        likes: 0,// on initialise à 0 nos likes
        dislikes: 0,// on initialise à 0 nos dislikes
        usersLiked: [],//on crée notre array qui va contenir les userId pour ceux qui likes
        usersDisliked: []//on crée notre array qui va contenir les userId pour ceux qui dislikes
    });
    sauce.save()// on sauvegarde sur notre base de donnée
        .then(() => res.status(201).json({message: 'Sauce enregistrée!'}))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})// on récupère la sauce séléctionnée
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({error}));
};

exports.modifySauce = (req, res, next) => {
    if (!nameRegex.test(req.body.name) || !nameRegex.test(req.body.manufacturer )) { 
        return res.status(400).json({ error });// erreur 400 
    }
    if (!descriptionRegex.test(req.body.description) || !descriptionRegex.test(req.body.mainPepper )) { 
        return res.status(400).json({ error });// erreur 400 
    }
    const sauceObject = req.file ?//on crée un objet sauceObject qui regarde si req.file existe ou non. S'il existe, on traite la nouvelle image ; s'il n'existe pas, on traite simplement l'objet entrant.
    {
        ...JSON.parse(req.body.sauce),
        imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`// ca correspond a ceci http://localhost:3000/images/<image-name>.jpg
    } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id })// on recupère l'object et on l'ajoute a la base de données
        .then(() => res.status(200).json({message: 'Sauce modifiée!'}))
        .catch(error => res.status(400).json({error}));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})// on récupère notre sauce de la base de donnée avant de la supprimer, on cherche le même id que celui dans les paramètres de la requête
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];// on extrait le nom du fichier à supprimer
            fs.unlink(`images/${filename}`, () => {// fs.unlink permet de supprimer le fichier, après on a le chemin du fichier entre paranthèse
                Sauce.deleteOne({ _id: req.params.id})// on supprime la sauce dans la base de donnée
                .then(() => res.status(200).json({message: 'Sauce supprimée!'}))// 200 tout est ok
                .catch(error => res.status(400).json({ error }));// 400 mauvaise requête
            });
        })
        .catch(error => res.status(500).json({ error }));// erreur serveur 500
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()// on récupère toutes nos sauces
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

 exports.likeSauce = (req, res, next) => {
    Sauce.findOne({// on récupère la sauce séléctionnée
        _id: req.params.id
    })
    .then(sauce => {
       // console.log(req.body);
        switch (req.body.like) { // permet de recuperer 0 ou 1 ou -1
            case 1 : // cas ou on va liké
                if (!sauce.usersLiked.includes(req.body.userId) ){ 
                Sauce.updateOne({_id: req.params.id}, {$inc: {likes: 1}, $push: {usersLiked: req.body.userId}, _id: req.params.id})
                    .then(() => res.status(201).json({message : "liké !" }))
                    .catch(error => res.status(400).json({error}));
                }
            break;
            case 0 : // cas ou on a liké et que l'on souhaite supprimer ou on a disliké et que l'on souhaite supprimer
                if (sauce.usersLiked.includes(req.body.userId)){ 
                    Sauce.updateOne({_id: req.params.id}, {$inc: {likes: -1}, $pull: {usersLiked: req.body.userId}, _id: req.params.id})
                    .then(() => res.status(201).json({message : "like supprimé" }))
                    .catch(error => res.status(400).json({error}));
                }
                else if (sauce.usersDisliked.includes(req.body.userId)){ 
                    Sauce.updateOne({_id: req.params.id}, {$inc: {dislikes: -1}, $pull: {usersDisliked: req.body.userId}, _id: req.params.id})
                        .then(() => res.status(201).json({message : "dislike supprimé" }))
                        .catch(error => res.status(400).json({error}));
                    }
            break;
            case -1 : // cas ou on va disliké
            if (!sauce.usersDisliked.includes(req.body.userId) ){ 
            Sauce.updateOne({_id: req.params.id}, {$inc: {dislikes: 1}, $push: {usersDisliked: req.body.userId}, _id: req.params.id})
                .then(() => res.status(201).json({message : "disliké !" }))
                .catch(error => res.status(400).json({error}));
            }
            break;
            default: 
            throw error;
        }
    })
    .catch(err => res.status(404).json({
        err
    }))

    
};