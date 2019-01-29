var express = require('express');
var router = express.Router();
var io = require('../socket/socket').io();

var Users = require('../models/users.js');

var newUser = "";
var newMessage = "";
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Online Chat'});
});

router.get('/startchat', function(req, res){
  if(newUser !== ""){
    res.render('users', {title: newUser,currentUser: newUser, users: Users});
    newUser = "";
  }else{
    res.redirect('/');
  }
});

router.post('/chat', function(req, res){
    newUser = req.body.userid;
    res.redirect('/startchat');
});

module.exports = router;
