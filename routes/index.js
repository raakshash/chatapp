var express = require('express');
var router = express.Router();
var passport = require('passport');

var Users = require('../models/users.js');

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
  var username = req.user.username;
  Users.splice(Users.indexOf(username), 1);
  res.render('users', { title: username, currentUser: username, users: Users });
  Users.push(username);
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
