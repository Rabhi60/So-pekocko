const jwt = require('jsonwebtoken');// on importe jwt pour vérifier nos tokens

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];// on va recuperer notre token qui est en deuxième élèment du tableau donc 1 et le bearer en 0
        const decodedToken = jwt.verify(token, 'TEST_TOKEN_SECRET');// on va décoder le token, donc on verifie le token et en deuximème argument la clé secrète
        const userId = decodedToken.userId;// on souhaite récuperer l'userId qu'on a encodé 
        if (req.body.userId && req.body.userId !== userId) {// si la demande contient un ID utilisateur, nous le comparons à celui extrait du token. S'ils sont différents, nous générons une erreur ;
            throw 'Invalid user ID';
        } else {
            next(); // si tout fonctionne et notre utilisateur est authentifié. Nous passons l'exécution à l'aide de la fonction next() .
        }
    } catch{
        res.status(401).json({ error: new Error('Invalid request!')});// erreur 401, requête non authentifiée
    }
};