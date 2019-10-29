const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');

function socket(server) {
  const io = socketIO(server);

  io.use(async function(socket, next) {
    const query = socket.handshake.query;
    if (!query.token) return next(new Error('anonymous sessions are not allowed'));
    const session = await Session.findOne({token: query.token}).populate('user');
    socket.user = session.user;
    next();
  });

  io.on('connection', function(socket) {
    socket.on('message', async (msg) => {
      const {displayName, id} = socket.user;
      await Message.create({
        user: displayName,
        chat: id,
        text: msg,
        date: new Date(),
      });
    });
  });

  return io;
}

module.exports = socket;
