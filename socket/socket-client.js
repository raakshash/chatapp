var sioc = require('socket.io-client');
var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);
var socket = null;

exports.io = function(){
    return socket;
}

exports.init = function(){
    socket = sioc.connect();
    var sendBtn = $('#send');
    sendBtn.on('click', function(e){
        socket.emit('message', $('#msg').val());
        $('#msg').val('');
        return false;
    });
    socket.on('message', function(msg){
        addMessage(msg);
    });
    var addMessage = function(msg){
        $('#messages').append($('<li>').text(msg));
    }
}