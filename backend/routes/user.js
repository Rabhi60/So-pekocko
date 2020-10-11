const express = require('express');
const bouncer = require('express-bouncer')(60000,900000,3);// on importe express-bouncer qui permet de bloquer le nombre de tentative ex: anti force brute, on a 3 paramètres entre parenthèse (temps d'attente minimum pour réésayer, temps d'attente max, et le nombre de tentative)
const router = express.Router();// on va utiliser la methode Router d'express
const userCtrl = require('../controllers/user');// on importe notre logique métier du dossier controllers que l'on va ajouter à nos routes

//logique de routine
router.post('/signup', userCtrl.signup);// la route pour s'inscrire
router.post('/login', bouncer.block, userCtrl.login);// la route pour s'authentifier

module.exports = router;// on exporte notre router