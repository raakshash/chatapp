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
  res.render('index', { title: 'Online Chat' });
});

router.get('/startchat', isLoggedIn, function (req, res) {
  if(newUser !== req.user.username){
    res.render('users', { title: req.user.username, currentUser: req.user.username, users: Users });
    newUser = req.user.username;
  }else{
    res.redirect('/logout');
  }
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

module.exports = router;
