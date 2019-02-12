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

router.post('/updateintent', function(req, res, next){
  Replies.findOne({'intent': req.body.intent}, function(err, iIntent){
    if(err){
      console.error("Error: "+ err);
      res.sendStatus(400).json({
        message: "Access denied"
      });
    }else{
      if(iIntent){
        iIntent.reply = req.body.intentReply;
        iIntent.save(function(err){
          if(err){
            console.error("Data not added: "+err);
          }
        });
      }
    }
  }).then(function(){
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
        newIntent.intent = req.body.intentFulifilled;
        newIntent.reply = req.body.intentReplyFulifilled;
        newIntent.save(function(err){
            if(err){
                console.error("Error: "+err);
            }
        });
      }else{
        iIntent.intent = req.body.intentFulifilled;
        iIntent.reply = req.body.intentReplyFulifilled;
        iIntent.save(function(err){
          if(err){
              console.error("Error: "+err);
          }
      });
    }
    res.redirect('/users')
  });
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