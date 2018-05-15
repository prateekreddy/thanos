var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
var inputSanitate = require('../lib/validation')
var Buy = require('../models/mongo.config.buy');
var Sell = require('../models/mongo.config.sell');
var creditScore = require('../models/mongo.config.creditScore');

/* GET home page. */
router.options('/*', (req, res, next) => {
  console.log("cors response")
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.send();
})

router.get('/', function(req, res, next) {
    Buy.create({
    user:"Akshay",
    nonce:1,
    contract:"Akshay contract",
    pubkey:"Akshay pubkey",
    amount:100,
    interest:3,
    signature:{
      version:"aa",
      r:"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      s:"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    }
  },function(err,doc){
      console.log(err)
      res.send("Hello World");
  })
});

router.post('/register', (req, res, next) => {
  console.log(req.body)
  creditScore.create({
    userId: req.body.userId,
    creditScore: 1000
  }, (err, doc) => {
    res.send({"status": "y", "info": "credit score initialized"})
  })
})

router.post('/getReputation', (req, res, next) => {
  console.log(req.body);
  creditScore.findOne({
    userId: req.body.userId 
  }, (err, doc) => {
    if(!err) {
      console.log(doc);
      res.send({
        status: "y",
        "reputation": doc.creditScore
      }) 
    } else {
      res.send({
        status: "n"
      }) 
    }
  })
})

module.exports = router;


// Buy.create({
//     user:"Akshay",
//     nonce:1,
//     contract:"Akshay contract",
//     pubkey:"Akshay pubkey",
//     amount:100,
//     interest:3,
//     signature:{
//       version:"aa",
//       r:"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
//       s:"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
//     }
//   },function(err,doc){
//       console.log(err)
//       console.log(doc)
//       res.send("Hello World");
//   })