var express = require('express');
var router = express.Router();
var io = require('../socket/socket').io();

var newUser = "";
var users = [];
var newMessage = "";
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Online Chat'});
});

router.get('/startchat', function(req, res){
  if(newUser !== "" && !users.find(function(user){
    return user == newUser;
  })){
    users.push({"name":newUser});
    res.render('users', {currentUser: newUser, users: users});
    newUser = "";
  }else{
    res.redirect('/');
  }
  
});

router.post('/chat', function(req, res){
    newUser = req.body.userid;
    res.redirect('/startchat');
});

router.get('/message', function(req, res){
  res.send(newMessage);
  
});

router.post('/message', function(req, res){
  console.log(req.body.msg);
  newMessage = req.body.msg;
  io.emit('message', newMessage);
  res.sendStatus(200);
});

module.exports = router;
