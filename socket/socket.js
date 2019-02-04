var sio = require('socket.io');
var io = null;

var Users = require('../models/users.js');

exports.io = function () {
    return io;
};


exports.init = function (server) {
    io = sio(server);

    io.of('/chat').on('connection', function (socket) {
        socket.on('createUserRoom', function (iRoomTitle) {
            if (!isUserExist(iRoomTitle)) {
                Users.push(iRoomTitle);
                socket.username = iRoomTitle;
                socket.emit('updateUsers', "");
                socket.broadcast.emit('updateUsers', iRoomTitle);
            }
        });
        socket.on('join', function (iRoomID) {
            socket.join(iRoomID);
        });
        socket.on('newMessage', function (iRoomID, iMsg) {
            socket.to(iRoomID).emit("addMessage", iMsg);
        });
        socket.on('disconnect', function(){
            console.log("user disconnected "+socket.username);
            socket.leave(socket.username);
            socket.broadcast.emit('removeUser', socket.username);
            Users.splice(Users.indexOf(socket.username), 1);
        })
    });
};

var isUserExist = function (iUser) {
    return (Users.indexOf(iUser) !== -1);
}