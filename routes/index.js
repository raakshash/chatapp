var express = require('express');
var router = express.Router();
var passport = require('passport');

var Users = require('../models/users.js');
var newUser = "";

var isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.status(400).redirect('/');
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Karo Chat' });
});

router.get('/startchat', isLoggedIn, function (req, res) {
  isCurrent(req.user.username);
  res.render('users', { title: req.user.username, currentUser: req.user.username, users: Users });
});

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/startchat',
  failureRedirect: '/'
}));

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/startchat',
  failureRedirect: '/'
}));

router.get('/logout', isLoggedIn, (req, res) => {
  req.logout();
  res.status(200).redirect('/');
});

var isCurrent = function(iUser){
  Users.forEach(function(user){
    if(user.username == iUser){
      user.isNotCurrent = false;
    }else{
      user.isNotCurrent = true;
    }
  });
}

module.exports = router;
