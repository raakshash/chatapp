'use strict';

var app = {
    init: function (iCurrentUser) {
        var currentRoomID = "";
        $(".content").hide();
        $(".messages").animate({ scrollTop: $(document).height() }, "fast");
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
        }
        if ("Notification" in window) {
            Notification.requestPermission().then(function (status) {
                console.log('Notification permission status:', status);
                // Notification['permission'] = status;
            });
        }
        $('.clear-chat button').click(function(){
            $('.sent').remove();
            $('.replies').remove();
            sessionStorage.removeItem(currentRoomID);
        });
        $('.signup').hide();
        $('#go-to-signup').click(function () {
            $('.login').hide();
            $('.signup').show();
        });
        $('#go-to-login').click(function () {
            $('.signup').hide();
            $('.login').show();
        });
        if(iCurrentUser !== ""){
            var socket = io('/chat', { transports: ['websocket'] });
            socket.on('connect', function (e) {
                if (iCurrentUser != "") {
                    socket.emit('createUserRoom', iCurrentUser);
                    socket.emit('join', iCurrentUser);
                }
                socket.on('updateUsers', function (iUser) {
                    if(iUser !== undefined){
                        var userExistLength = $('[data-username="' + iUser.username + '"]').length;
                        if (iUser.username != "" && userExistLength < 1) {
                            app.UpdateUsers(iUser);
                            app.createNotificationOnNewUser(iUser.username);
                        }else{
                            var contactStatusElem = $('[data-username="' + iUser.username + '"] .contact-status');
                            if(iUser.status === "away"){
                                contactStatusElem.removeClass("online");
                                contactStatusElem.addClass(iUser.status);
                            }else{
                                contactStatusElem.removeClass("away");
                                contactStatusElem.addClass(iUser.status);
                            }
                        }
                    }
                    $(".contact").on('click', function (e) {
                        $(".contact").removeClass("active");
                        $(this).addClass('active');
                        currentRoomID = $(this).data("username");
                        $(".contact-profile p").text(currentRoomID);
                        $('.sent').remove();
                        $('.replies').remove();
                        $(".content").show();
                        var currentRoomMessages = JSON.parse(sessionStorage.getItem(currentRoomID));
                        if (currentRoomMessages != null) {
                            for (var i = 0; i < currentRoomMessages.length; i++) {
                                var iMessage = currentRoomMessages[i];
                                app.renderMessage(iMessage.msg, iMessage.class);
                            }
                        }
                        var messageheight = $('.messages').prop("scrollHeight");
                        $(".messages").animate({ scrollTop: messageheight }, "fast");
                        app.removeMessagePreview(currentRoomID);
                    });
                });
                socket.on('removeUser', function (iUser) {
                    if ($('.active').data("username") === iUser) {
                        $(".contact").removeClass("active");
                        $('.content').hide();
                    }
                    $('[data-username="' + iUser + '"]').remove();
                });
                $('.submit').click(function () {
                    var message = {
                        messageContent: $(".message-input input").val(),
                        username: iCurrentUser,
                        date: Date.now()
                    };
                    socket.emit("newMessage", currentRoomID, message);
                    app.newMessage(message, "sent", currentRoomID);
                });

                socket.on("addMessage", function (iMsg) {
                    app.createNotificationOnNewMessage(iMsg);
                    app.newMessage(iMsg, "replies", currentRoomID);
                });

                socket.on("autoMessage", function(iMsg, iRoomID){
                    app.newMessage(iMsg, "sent", iRoomID);
                });

                $('#text-msg').off('keydown').on('keydown', function (e) {
                    if (e.which == 13) {
                        var message = {
                            messageContent: $(".message-input input").val(),
                            username: iCurrentUser,
                            date: Date.now()
                        };
                        socket.emit("newMessage", currentRoomID, message);
                        app.newMessage(message, "sent", currentRoomID);
                        return false;
                    }
                });
            });
        }
    },
    UpdateUsers: function(iUser) {
        var users = $('#all-users');
        var liComp = $('<li>').addClass("contact");
        liComp.attr("data-username", iUser.username);
        var divComp = $('<div>').addClass("wrap");
        var spanElem = $('<span>').addClass("contact-status").addClass(iUser.status);
        var imgElem = $('<img>').attr("src", "https://ptetutorials.com/images/user-profile.png");
        var metaElem = $('<div>').addClass("meta").append($('<p>').addClass("name").text(iUser.username));
        divComp.append(spanElem);
        divComp.append(imgElem);
        divComp.append(metaElem);
        liComp.append(divComp);
        users.append(liComp);
    },
    createNotificationOnNewMessage: function(iIncomingMessage) {
        var options = {
            body: iIncomingMessage.messageContent,
            icon: 'https://ptetutorials.com/images/user-profile.png',
        }
        Notification
            .requestPermission()
            .then(function () {
                var notification = new Notification(iIncomingMessage.username + " sent a message", options);
                setTimeout(notification.close.bind(notification), 5000);
            });
    },
    createNotificationOnNewUser: function(iNewUser) {
        var options = {
            //body: iIncomingMessage.messageContent,
            icon: 'https://ptetutorials.com/images/user-profile.png',
        }
        Notification
            .requestPermission()
            .then(function () {
                var notification = new Notification(iNewUser + ": A new user joined", options);
                setTimeout(notification.close.bind(notification), 5000);
            });
    },

    newMessage: function(iMsg, iClass, iCurrentRoomID) {
        var chatStoreRoom = iCurrentRoomID;
        if (iClass === "replies") {
            chatStoreRoom = iMsg.username;
        }
        if (sessionStorage.getItem(chatStoreRoom) == null) {
            var messagesLocal = [{ msg: iMsg, class: iClass }];
            sessionStorage.setItem(chatStoreRoom, JSON.stringify(messagesLocal));
        } else {
            var storedMessages = JSON.parse(sessionStorage.getItem(chatStoreRoom));
            storedMessages.push({ msg: iMsg, class: iClass });
            sessionStorage.setItem(chatStoreRoom, JSON.stringify(storedMessages));
        }
        if (iClass == "sent") {
            app.renderMessage(iMsg, iClass);
        } else {
            if (iMsg.username == iCurrentRoomID) {
                app.renderMessage(iMsg, iClass);
            } else {
                app.addMessagePreview(iMsg);
            }
        }
        var messageheight = $('.messages').prop("scrollHeight");
        $(".messages").animate({ scrollTop: messageheight }, "fast");
    },
    addMessagePreview: function(iIncomingMessage) {
        app.removeMessagePreview(iIncomingMessage.username);
        var msgPreview = $('<p>').addClass('preview').text(iIncomingMessage.messageContent);
        $('[data-username="' + iIncomingMessage.username + '"] .wrap .meta').append(msgPreview);
    },
    removeMessagePreview: function(iCurrentActiveRoom) {
        $('[data-username="' + iCurrentActiveRoom + '"] .wrap .meta .preview').remove();
    },
    renderMessage: function(iMsg, iClass) {
        if ($.trim(iMsg.messageContent) == '') {
            return false;
        }
        $('<li class="' + iClass + '"><img src="https://ptetutorials.com/images/user-profile.png" alt="" /><p>' + iMsg.messageContent + '</p></li>').appendTo($('.messages ul'));
        if (iClass === "sent") {
            $('.message-input input').val(null);
        }
        // $('.contact.active .preview').html('<span>You: </span>' + iMsg.messageContent);
    }
}