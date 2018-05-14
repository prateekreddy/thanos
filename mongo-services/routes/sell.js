var express = require('express');
var router = express.Router();
var Sell = require('../models/mongo.config.sell');
var Buy = require('../models/mongo.config.buy')
var inputSanitate = require('../lib/validation')

router.post('/list',function(req,res,next){
  Buy.findById(req.body._id)
      .populate('bid')
      .exec(function(err,data){
          console.log(err);
          res.send(data.bid)
      })
})

router.post('/unset', function(req, res, next) {
  console.log("Sell/")
  console.log(req.body)
  Buy.findOneAndUpdate({
    _id:req.body.id
  } ,{
      $set:{
        expired: false,
        lender:"None"
      }   
  },{
      new:false
  },function(err,doc){
    console.log(err)
    console.log(doc)
      res.send({"status":"y","info":"loan approved"})
  }).catch(function(err){
    res.send({"status":"n","info":"loan failed"})
  });
})

router.post('/', function(req, res, next) {
  console.log("Sell/")
  console.log(req.body)
  Buy.findOneAndUpdate({
    _id:req.body.id
  } ,{
      $set:{
        expired: true,
        lender:req.body.lender
      }   
  },{
      new:false
  },function(err,doc){
    console.log(err)
    console.log(doc)
      res.send({"status":"y","info":"loan approved",doc:doc})
  }).catch(function(err){
    res.send({"status":"n","info":"loan failed"})
  });
})

router.post('/bid', (req, res, next) => {
  Sell.create({
    lenderId:req.body.lenderId,
    borrowerId: req.body.borrowerId,
    loanId: req.body.loanId,
    amount:req.body.amount,
    duration: req.body.duration,
    interest:req.body.interest,
    installment: req.body.installment
  }, function(err,doc){
    console.log(doc);
    if(!err){
        Buy.findOneAndUpdate({
          _id: req.body.loanId,
          expired: false
        }, {
          $push:{
            bids: doc._id
          }   
        }, (err, res) => {
          if(!err) {
            res.send({"status":"y","info":"bid submitted successfully",doc:doc});
          } else {
            res.send({"status":"n","info":"mongo error"})
          }
        })
    } else {
      res.send({"status":"n","info":"mongo error"})
    }
    
})

  
})

router.post('/bid/list', (req, res, next) => {
  const lenderId = req.body.lenderId;
  Sell.find({
    lenderId
  }).exec((err, doc) => {
    if(!err) {
      res.send({"status": "y", "info": "negotioation list", list: doc});
    } else {
      res.send({"status":"n","info":"mongo error"})
    }
  })
});

module.exports = router;


// Sell.create({
//   user:"Akshay",
//   nonce:1,
//   contract:"Akshay contract",
//   pubkey:"Akshay pubkey",
//   amount:100,
//   interest:3,
//   signature:{
//     version:"aa",
//     r:"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
//     s:"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
// },function(err,doc){
//     if(err !=null){
//       console.log(err)
//       console.log(doc)
//       res.send({"status":"n","info":"mongo error"})
//     }else{
//         Buy.findOneAndUpdate({
//           user: "Akshay",
//           expired: false
//         },{
//           $push:
//           {
//             bid:doc._id
//           }
//         },{
//           new: true
//         },
//         function(err,doc){
//           console.log(err)
//           console.log(doc)
//           res.send({"status":"y","info":"request created successfully"});
//         }
//       )
      
//     }
//   }
    
// })