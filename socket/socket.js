var sio = require('socket.io');
var io = null;

var Users = require('../models/users.js');
var Replies = require('../models/replies.js');
const Wit = require('node-wit').Wit;

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
        });
        socket.on('newMessage', function (iRoomID, iMsg) {
            iRoomID = iRoomID.toLowerCase();
            if(iRoomID === "admin"){
                socket.to(iRoomID).emit("addMessage", iMsg);
                getInteractiveMessage(iMsg.messageContent.toLowerCase()).then(function(iReply){
                    if(iReply.length > 0){
                        for(var i = 0; i < iReply.length; i++){
                            let replyRandomIndex = Math.floor(Math.random() * iReply[i].reply.length);
                            let autoMessage = {
                                messageContent: iReply[i].reply[replyRandomIndex],
                                username: 'admin',
                                date: Date.now()
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


var getInteractiveMessage = function (iMessageContent) {
    const client = new Wit({
        accessToken: 'OVD36ZXM3YESNQEYSMQL45PXYTC7INYK'
    });
    return client.message(iMessageContent, {})
        .then((data) => {
            var userIntent = [];
            data.entities.intent.forEach(function(iUserIntent){
                userIntent.push(iUserIntent.value);
            });
            return findIntentData(userIntent);
            // data = JSON.stringify(data);
            // console.log(data);
        });
};

var findIntentData = function(iUserIntent){
    return Replies.find({'intent': iUserIntent}, function(err, iReply){
        if(err){
            return console.error("Error: "+err);
        }
        if(iUserIntent.length !== iReply.length){
            for(let i = 0; i < iUserIntent.length; i++){
                if(iReply[i] === undefined || iReply[i] != undefined && iUserIntent[i] !== iReply[i].intent){
                    var newReply = new Replies();
                    newReply.intent = iUserIntent;
                    newReply.reply = [];
                    newReply.save(function(err){
                        if(err){
                            console.error("Error: "+err);
                        }
                    });
                }
            }
        }
        if(iReply.length > 0){
            return iReply;
        }
    });
};