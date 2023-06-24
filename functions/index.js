require('dotenv').config();
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');

const { dbConnection } = require('./database/config');

const app = express();
// app.set('port', process.env.PORT || 3000)
app.use(cors());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));

dbConnection();

app.use(express.static('uploads'));

// Para crear las rutas 
app.use('./.netlify/functions/index/api/country', require('./routes/country'));
app.use('./.netlify/functions/index/api/usuarios', require('./routes/usuarios'));
app.use('./.netlify/functions/index/api/login', require('./routes/auth'));


app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/index.html'));
})

// CODIGOS PARA VERSION CON SOCKET
var server = app.listen(process.env.PORT, () => {
  console.log('Servidor corriendo en puerto ' + process.env.PORT);
})

// Socket IO
var io = require('socket.io')(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }, pingTimeout: 120000
});
app.set('io', io); // agregamos io (el socket) a la api existente

// Métodos scoket
require('./socket')(io);
module.exports.handler = serverless(app);
