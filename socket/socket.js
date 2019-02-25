var sio = require('socket.io');
var io = null;

var Users = require('../models/users.js');
const autotext = require('../autotext/index.js');


exports.io = function () {
    return io;
};


exports.init = function (server) {
    io = sio(server);

    io.of('/chat').on('connection', function (socket) {
        socket.on('createUserRoom', function (iRoomTitle) {
            iRoomTitle = iRoomTitle.toLowerCase();
            var newUser = isUserExist(iRoomTitle);
            if (newUser == null) {
                newUser = {
                    username: iRoomTitle,
                    status: "online",
                    isNotCurrent: true
                };
                Users.push(newUser);
            } else {
                newUser.status = "online";
            }
            socket.user = newUser;
            socket.emit('updateUsers');
            socket.broadcast.emit('updateUsers', newUser);
        });
        socket.on('join', function (iRoomID) {
            iRoomID = iRoomID.toLowerCase()
            socket.join(iRoomID);
            let greetMessage = {
                messageContent: "Hi "+iRoomID+"! This is kitchen assistant. I am here to help you to design your dream kitchen",
                username: 'admin',
                date: Date.now()
            };
            socket.emit("greet", greetMessage);
        });
        socket.on('newMessage', function (iRoomID, iMsg) {
            iRoomID = iRoomID.toLowerCase();
            if(iRoomID === "admin"){
                socket.to(iRoomID).emit("addMessage", iMsg);
                autotext.Dialogflow.getInteractiveMessage(iMsg.messageContent.toLowerCase()).then(function(iReply){
                    if(iReply.length > 0){
                        for(var i = 0; i < iReply.length; i++){
                            let replyRandomIndex = Math.floor(Math.random() * iReply[i].reply.length);
                            let autoMessage = {
                                messageContent: iReply[i].reply[replyRandomIndex],
                                username: 'admin',
                                date: Date.now(),
                                action: iReply[i].action
                            };
                            setTimeout(() => {
                                socket.to(iRoomID).emit("autoMessage", autoMessage, socket.user.username);
                                socket.emit("addMessage", autoMessage);
                            }, i*200+100);
                        }
                    }
                });
            }else{
                socket.to(iRoomID).emit("addMessage", iMsg);
            }
        });
        socket.on('disconnect', function () {
            if (socket.user !== undefined) {
                console.log("user disconnected " + socket.user.username);
                socket.leave(socket.user.username);
                socket.user.status = "away";
                socket.broadcast.emit('updateUsers', socket.user);
            }
        })
    });
};

var isUserExist = function (iUser) {
    for (var i = 0; i < Users.length; i++) {
        if (iUser == Users[i].username) {
            return Users[i];
        }
    }
    return null;
};