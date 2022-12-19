const http = require('http'); //inclure le module http dans cette constante
const app = require('./app'); // Importer l'application


// Fonction qui vérifie que le port fourni est un nombre valide

const normalizePort = val => {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

// Configutaion du port

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port); 

// Fonction qui vérifie quel type d'erreur s'est produite

const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
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

const server = http.createServer(app); //fonction appelée à chaque requête reçue par le serveur, on lui passe l'application


// Fonction d'écoute des demandes entrantes

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port); 
