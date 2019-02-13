var express = require('express');
var router = express.Router();

var Replies = require('../models/replies.js');

/* GET users listing. */
router.get('/', function (req, res, next) {
  Replies.find({}, function (err, iIntents) {
    if (err) {
      res.sendStatus(400).json({
        'message': 'access denied'
      });
    } else {
      res.render('dataform', {title: 'Karo Chat', intentData: iIntents});
    }
  });
});

router.post('/updateintent/:_intent', function(req, res, next){
  Replies.findOne({'intent': req.params._intent}, function(err, iIntent){
      if(err){
        console.error('Error: '+err);
      }
      if(!iIntent){
        var newIntent = new Replies();
        newIntent.reply = [];
        newIntent.reply.push(req.body.intentReplyFulifilled);
        newIntent.save(function(err){
            if(err){
                console.error("Error: "+err);
            }
        });
      }else{
        iIntent.reply.push(req.body.intentReplyFulifilled);
        iIntent.save(function(err){
          if(err){
              console.error("Error: "+err);
          }
      });
    }
    res.redirect('/users');
  });
});

router.post('/addintent', function(req, res, next){
  var newIntent = new Replies();
  newIntent.intent = req.body.intentToAdd;
  newIntent.reply = [];
  newIntent.reply.push(req.body.intentReplyToAdd);
  newIntent.save(function(err){
    if(err){
        console.error("Error: "+err);
    }
  });
  res.redirect('/users');
});

router.post('/deleteintent/:_intent', function(req, res, next){
  Replies.deleteOne({'intent': req.params._intent}, function(err){
    if(err){
      console.error('Error: '+err);
    }
    res.redirect('/users')
  });
});

module.exports = router;