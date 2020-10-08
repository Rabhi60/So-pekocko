const express = require('express');// on importe express pour pouvoir créer notre Router
const router = express.Router();// on va utiliser la methode Router d'express

const auth = require('../middleware/auth');// on utilse ce middleware pour protéger nos routes (auth)
const multer = require('../middleware/multer-config');// on ajoute ce middleware pour gérer nos fichiers

const sauceCtrl = require('../controllers/sauce');// on importe notre logique métier du dossier controllers que l'on va ajouter a nos routes

// la logique routine
router.get('/', auth, sauceCtrl.getAllSauces);// auth correspond a l'authentification avant l'accès au sauce
router.post('/', auth, multer, sauceCtrl.createSauce);// on importe notre multer mais après l'auth
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router;// on exporte notre router