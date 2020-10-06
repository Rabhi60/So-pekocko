const express = require('express');// on importe express
const bodyParser = require('body-parser');// on importe body-parser
const mongoose = require('mongoose');// on importe mongoose


const app = express();// on créé notre application express

mongoose.connect('mongodb+srv://Moderator:EvalduP6@cluster0.ffjmq.mongodb.net/<dbname>?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB Atlas réussie !'))
  .catch(() => console.log('Connexion à MongoDB Atlas échouée !'));



app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');// origine permet de voir qui peut utilser l'API, l'étoile permet de dire que tou le monde peut accéder
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');// on donne l'autorisation d'utiliser certains en-tête
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');// on donne l'autorisation d'utiliser certaines méthodes les verbes de requête GET, POST...
    next();
});

app.use((req, res) => {
   res.json({ message: 'Votre requête a bien été reçue !' }); 
});

app.use(bodyParser.json());//Pour toutes les routes de notre application, c'est ce qui va transformer le corps de la requête en objet JavaScript utilisable, ce middleware sera global pour l'application

module.exports = app;// on va exporter cette application (const app), pour pouvoir l'utilser sur nos autres fichiers du projet