var sio = require('socket.io');
var io = null;

exports.io = function () {
    return io;
};


exports.init = function (server) {
    io = sio(server);
    io.on('connection', function (socket) {
        console.log('a user connected');
        socket.on('disconnect', function () {
            console.log('user disconnected');
        });
        socket.on('message', function (msg) {
            console.log('message: ' + msg.message);
            console.log('user: ' + msg.user);
            console.log('last user: ' + msg.lastUser);
            io.emit('message', msg);
            msg.lastUser = msg.user;
        });
    });
};