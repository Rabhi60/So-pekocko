const bcrypt = require('bcrypt');// on importe bcrypt qui va nous permettre de crypter nos mots de passe
const jwt = require('jsonwebtoken');// on importe jsonwebtoken
const emailValidator = require('email-validator');

const User = require('../models/User');// on importe notre schéma User
const passwordValidator = require('../middleware/passwordValidator');
const emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

exports.signup = (req, res , next) => {
    if (!emailValidator.validate(req.body.email) || !emailRegex.test(req.body.email)) { 
        return res.status(401).json({ error: 'accès refusé' });// erreur 401 email non valide
    }
    if (!passwordValidator.validate(req.body.password)) { 
        return res.status(401).json({ error: 'accès refusé' });// erreur 401 mot de passe non valide
    }
    bcrypt.hash(req.body.password, 10)// on appelle la fonction de hachage de bcrypt dans notre mot de passe et lui demandons de « saler » le mot de passe 10 fois.
        .then(hash => {
            const user = new User({//on crée un nouvel utilisateur dans la base de donnée
                email: req.body.email,// on va fournir l'adresse mail qui est dans le corps de la requête
                password: hash// on va fournir le mot de passe haché
            });
            user.save()// ici on l'enregistre 
                .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))// 201 créé et modifiée 
                .catch(error => res.status(400).json({ error }));//erreur 400 mauvaise requête
        })
        .catch(error => res.status(500).json({ error }));// erreur serveur 500
};

exports.login = (req, res , next) => { 
    if (!emailValidator.validate(req.body.email) || !emailRegex.test(req.body.email)) { 
        return res.status(401).json({ error: 'accès refusé' });// erreur 401 email non valide
    } 
    if (!passwordValidator.validate(req.body.password)) { 
        return res.status(401).json({ error: 'accès refusé' });// erreur 401 mot de passe non valide
    }
    User.findOne({ email: req.body.email })// on va chercher l'email de l'utilsateur dans la base de donnée
        .then(user => {
            if (!user){// si on ne trouve pas d'email correspondant on renvoie l'erreur ci-dessous
                return res.status(401).json({ error });// erreur 401 non autorisé
            }
            bcrypt.compare(req.body.password, user.password)// si l'email correspond on utilie la fonction compare de bcrypt pour comparer le mot de passe entré par l'utilisateur avec le hash enregistré dans la base de données 
            .then(valid => {
                if (!valid){// si le mot de passe ne correspond pas on renvoie une erreur 401
                    return res.status(401).json({ error });// erreur 401 non autorisé
                }
                res.status(200).json({// on envoie response 200 pour une requête correct qui contient l'ID de l'utilisateur et un token
                    userId: user._id,
                    token: jwt.sign(// on utilise la fonction sign dejsonwebtoken pour encoder un nouveau token 
                        { userId: user._id},//ce token contient l'ID de l'utilisateur en tant que payload
                        'TEST_TOKEN_SECRET',// on utilise une chaîne secrète
                        { expiresIn: '24h'}// on définit la durée de validité du token à 24 heures. L'utilisateur devra donc se reconnecter au bout de 24 heures ;
                    )
                });
            })
            .catch(error => res.status(500).json({ error }));// erreur serveur 500
        })
        .catch(error => res.status(500).json({ error }));// erreur serveur 500 
};