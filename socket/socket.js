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
            var newUser = isUserExist(iRoomTitle);
            if (newUser == null) {
                newUser = {username: iRoomTitle, status: "online", isNotCurrent: true};
                Users.push(newUser);
            }else{
                newUser.status = "online";
            }
            socket.user = newUser;
            socket.emit('updateUsers');
            socket.broadcast.emit('updateUsers', newUser);
        });
        socket.on('join', function (iRoomID) {
            socket.join(iRoomID);
        });
        socket.on('newMessage', function (iRoomID, iMsg) {
            socket.to(iRoomID).emit("addMessage", iMsg);
        });
        socket.on('disconnect', function(){
            if(socket.user !== undefined){
                console.log("user disconnected "+socket.user.username);
                socket.leave(socket.user.username);
                socket.user.status = "away";
                socket.broadcast.emit('updateUsers', socket.user);
            }
        })
    });
};

var isUserExist = function (iUser) {
    for(var i = 0; i < Users.length; i++){
        if(iUser == Users[i].username){
            return Users[i];
        }
    }
    return null;
};