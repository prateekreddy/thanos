var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
var Buy = require('../models/mongo.config.buy');
var Sell = require('../models/mongo.config.sell')
/* GET home page. */

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