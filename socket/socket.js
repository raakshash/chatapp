var sio = require('socket.io');
var io = null;
var users = [];

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
        socket.on('typing', function (data) {
            if (data !== undefined) {
                socket.broadcast.emit('typing', {
                    "username": data.username
                });
            } else {
                socket.broadcast.emit('typing');
            }
        });
        socket.on('newUserAdded', function (iNewUser) {
            socket.emit("updateUserList", users);
            socket.broadcast.emit("updateUserList", users);
            users.push(iNewUser);
        });
        socket.on('createRoom', function (iRoomName) {
            var isRoomAvailable = users.find(function (iElem) {
                return iRoomName == iElem;
            });
            if (users.length == 0) {
                socket.emit()
            } else if (!isRoomAvailable) {
                users.push(iRoomName);
                socket.emit("updateRoomList", iRoomName);
                socket.broadcast.emit("updateRoomList", iRoomName);
            }
        });
    });

    io.of('/chat').on('connection', function (socket) {
        socket.on('createUserRoom', function(iRoomTitle){
            socket.emit('updateUsers', iRoomTitle);
            socket.broadcast.emit('updateUsers', iRoomTitle);
        });
        socket.on('join', function(iRoomID){
            socket.join(iRoomID);
        });
        socket.on('newMessage', function(iRoomID, iMsg){
            socket.broadcast.to(iRoomID).emit("addMessage", iMsg);
        });
    });
};