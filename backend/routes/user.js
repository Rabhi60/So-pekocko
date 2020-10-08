const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');// on importe notre logique métier du dossier controllers que l'on va ajouter à nos routes

//logique de routine
router.post('/signup', userCtrl.signup);// la route pour s'inscrire
router.post('/login', userCtrl.login);// la route pour s'authentifier

module.exports = router;// on exporte notre router