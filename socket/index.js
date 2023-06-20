const jwt = require('jsonwebtoken');
const { crearSesion, cerrarSesion } = require('../controllers/socket/sesion');
const { registrarMensajeDeGrupo, registrarMensajePrivado, getFirstMessages, getMoreMessagesStartAt } = require('../controllers/socket/mensajeria');
const { getNotifications, marcarLeidas } = require('../controllers/socket/notificaciones');
const { setMyCurrentClassTime, setClassesAsCompleted } = require('../controllers/socket/streaming');
module.exports = io => {
  io.use(function (socket, next) {
    if (socket.handshake.query && socket.handshake.query.token) {
      jwt.verify(socket.handshake.query.token, process.env.JWT_SECRET, function (err, decoded) {
        if (err) return next(new Error('Authentication error'));
        socket.decoded = decoded;
        next();
      });
    }
    else {
      next(new Error('Authentication error'));
    }
  }).on('connection', socket => {
    socket.emit("authenticated");
    socket.on('logIn', async (request) => {
      const sesionResult = crearSesion(request.email, socket.id);
      if (sesionResult) {
        console.log(request.email, "Se ha conectado con el ID:", socket.id);

        // Obtener Mensajes
        const messages = await getFirstMessages(request.email);
        socket.emit('firstMessages', messages);

        // Obtener notificaciones
        const notifications = await getNotifications(request.email);
        socket.emit('firstNotifications', notifications);
      }
    });

    // Cerrar sesión (por el usuario)
    socket.on('logout', request => {
      cerrarSesion(request.email);
      console.log(request.email, "Ha cerrado sesión");
    });

    // Al desconectar
    socket.on('disconnect', () => {
      console.log("Conexión perdida");
    });


    // ******************** Mensajería **********************
    socket.on('sendMessagePrivate', async request => {
      const { receptor, transmissor, message } = request;
      const registroResult = await registrarMensajePrivado(receptor, transmissor, message, io);
      if (registroResult) {
        io.to(registroResult.socket).emit('newPrivateMessage', registroResult.message);
      }
    });
    socket.on('sendMessageGroup', async request => {
      const { group, transmissor, message } = request;
      const resp = await registrarMensajeDeGrupo(group, transmissor, message, io);
      if (resp.sockets.length != 0) {
        resp.sockets.map((sk) => {
          io.to(sk).emit('newGroupMessage', { message: resp.message, group: resp.group });
        })
      }
    });

    socket.on('requestMoreFromthisChat', async request => {
      const { start, contact, from } = request;
      const moreResult = await getMoreMessagesStartAt(start, contact, from);
      if (moreResult) {
        socket.emit('getMoreMessagesFromActiveChat', moreResult);
      }
    });

    // ******************** Notificaciones **********************

    socket.on('markAsReadedNotifications', async (request) => {
      const { email } = request;
      marcarLeidas(email);
    });

    // ********************** Streaming ************************

    socket.on('setStreamCurrentTime', async (request) => {
      const { email, currentTime, clase } = request;
      setMyCurrentClassTime(email, currentTime, clase);
    });
    socket.on('setStreamClassEnded', async (request) => {
      const { email, clase } = request;
      setClassesAsCompleted(email, clase);
    });
    
  });
}
