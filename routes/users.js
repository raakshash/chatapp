var express = require('express');
var router = express.Router();

var Replies = require('../models/replies.js');
var isIntentSelected = false;
var currentIntentData = null;

/* GET users listing. */
router.get('/', function (req, res, next) {
  Replies.find({}, function (err, iIntents) {
    if (err) {
      res.sendStatus(400).json({
        'message': 'access denied'
      });
    } else {
      res.render('dataform', {
        title: 'Karo Chat',
        intentData: iIntents,
        isIntentDataSelected: isIntentSelected,
        currentIntent: currentIntentData
      });
    }
  });
});

router.get('/:_intent', function(req, res, next){
  Replies.findOne({'intent': req.params._intent}, function(err, iCurrentIntentData){
    if(err){
      console.error("Error: "+err);
    }
    if(!iCurrentIntentData){
      isIntentSelected = false;
      currentIntentData = null;
    }else{
      isIntentSelected = true;
      currentIntentData = iCurrentIntentData;
    }
    res.redirect('/users');
  });
});

router.post('/updateintent/:_intent', function(req, res, next){
  Replies.findOne({'intent': req.params._intent}, function(err, iIntent){
      if(err){
        console.error('Error: '+err);
      }
      if(!iIntent){
        var newIntent = new Replies();
        newIntent.intent = req.params._intent;
        newIntent.reply = [];
        newIntent.reply.push(req.body.intentReplyToAdd);
        newIntent.save(function(err){
            if(err){
                console.error("Error: "+err);
            }
        });
        isIntentSelected = true;
        currentIntentData = newIntent;
      }else{
        iIntent.reply.push(req.body.intentReplyToAdd);
        iIntent.save(function(err){
          if(err){
              console.error("Error: "+err);
          }
        });
        isIntentSelected = true;
        currentIntentData = iIntent;
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
  isIntentSelected = true;
  currentIntentData = iIntent;
  res.redirect('/users');
});

module.exports = router;