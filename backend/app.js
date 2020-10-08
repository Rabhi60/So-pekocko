const express = require('express');// on importe express
const bodyParser = require('body-parser');// on importe body-parser
const mongoose = require('mongoose');// on importe mongoose
const helmet = require('helmet');
const path = require('path');// on importe path qui nous donne accès au chemin de notre système de fichier

const dotenv = require('dotenv');// on importe dotenv pour masquer l'url/mdp/nom d'hôte
dotenv.config();

const sauceRoutes = require('./routes/sauce');// la routes qui correspond a nos sauces (GET/POST/PUT/DELETE)
const userRoutes = require('./routes/user');// la routes qui correspond a l'authentification (POST)

mongoose.connect(process.env.DB_ADMIN_URI,//cette partie permet de nous connecter a MongoDB, ici on a utiliser un fichier .env pour cacher nos données
  { 
    dbName:process.env.DB_ADMIN_DBNAME,// nom de la table
    user:process.env.DB_ADMIN_USERNAME,// nom de l'utilsateur
    pass:process.env.DB_ADMIN_PASSWORD,// mot de passe
    useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB Atlas réussie !'))
  .catch(() => console.log('Connexion à MongoDB Atlas échouée !'));

const app = express();// on créé notre application express

app.use((req, res, next) => {// partie cors
    res.setHeader('Access-Control-Allow-Origin', '*');// origine permet de voir qui peut utilser l'API, l'étoile permet de dire que tou le monde peut accéder
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');// on donne l'autorisation d'utiliser certains en-tête
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');// on donne l'autorisation d'utiliser certaines méthodes les verbes de requête GET, POST...
    next();
});

app.use(bodyParser.json());//Pour toutes les routes de notre application, c'est ce qui va transformer le corps de la requête en objet JavaScript utilisable, ce middleware sera global pour l'application

app.use('/images', express.static(path.join(__dirname, 'images')));// pour les requêtes a /images, express.static est utiliser pour servir un dossier static, on utilise la methode path.joint que l'on va lui passer dirname qui est le nom dossier dans lequel on va se trouver et on lui ajoute images qui est le dossier static

app.use(helmet());

app.use('/api/sauces', sauceRoutes);// on utilse cette base pour toutes nos routes sauce
app.use('/api/auth', userRoutes);// on utilse cette base pour toutes nos authentification

module.exports = app;// on va exporter cette application (const app), pour pouvoir l'utilser sur nos autres fichiers du projet