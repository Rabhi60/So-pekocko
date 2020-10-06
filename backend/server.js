const http = require('http');// on importe le package http de node
const app = require('./app');// on importe notre application de notre fichier app.js

const normalizePort = val => {//la fonction normalizePort renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne ;
    const port = parseInt(val, 10);

    if (isNaN(port)){
        return val;
    }
    if (port >= 0){
        return port;
    }
    return false;
};
const port = normalizePort(process.env.PORT || '3000');// si dans l'environnement où on travaille a un port dédié on l'utilse sinon on utilise le port 3000
app.set('port', port);//on lui dis sur quel port il va tourner

const errorHandler = error => {//la fonction errorHandler  recherche les différentes erreurs et les gère de manière appropriée. Elle est ensuite enregistrée dans le serveur ;
    if (error.syscall !== 'listen'){
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code){
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

const server = http.createServer(app);// on créé notre serveur et on lui passe notre application, cette function va recevoir la requête et la reponse.

server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listenig on ' + bind);
});

server.listen(port);//le serveur écoute les requêtes du port utilisé