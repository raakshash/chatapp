var express = require('express');
var router = express.Router();

var newMessage = "";
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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
