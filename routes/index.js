var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

var newUser = "";
var newMessage = "";
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Online Chat'});
});

router.get('/startchat', function(req, res){
  if(newUser !== ""){
    res.render('chatbox', {currentUser: newUser});
    newUser = "";
  }else{
    res.redirect('/');
  }
  
});

router.post('/chat', function(req, res){
    newUser = req.body.name;
    res.redirect('/startchat');
});

router.get('/message', function(req, res){
  res.send(newMessage);
  
});

router.post('/message', function(req, res){
  var io = require('../socket/socket').io();
  console.log(req.body.msg);
  newMessage = req.body.msg;
  io.emit('message', newMessage);
  res.sendStatus(200);
});

module.exports = router;
