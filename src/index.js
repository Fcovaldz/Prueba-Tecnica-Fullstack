const http = require('http');
const path = require('path');

const express = require('express');
const socketio = require('socket.io');

const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Conexion DB
mongoose.connect('mongodb://localhost/chat-database')
.then(db => console.log('db conectada'))
.catch(err => console.log(err));


// Configuracion
app.set('port', process.env.PORT || 8080);
require('./sockets')(io);

// Enviando archivos estaticos
app.use(express.static(path.join(__dirname, 'public')));

// Empezando el servidor
server.listen(app.get('port'), () => {
    console.log('server en puerto 3000', app.get('port'));
});