var express = require('express');
var router = express.Router();
var Sell = require('../models/mongo.config.sell');
var Buy = require('../models/mongo.config.buy')
var Loans = require('../models/mongo.config.loans');
var Reputation = require('../models/mongo.config.creditScore');
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
  const sig= { 
          version:"aa",
          r:"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
          s:"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
        }
  Sell.create({
    lenderId:req.body.lenderId,
    borrowerId: req.body.borrowerId,
    loanId: req.body.loanId,
    amount:req.body.amount,
    duration: req.body.duration,
    interest:req.body.interest,
    installment: req.body.installment,
    signature: sig
  }, function(err,doc){
    console.log(doc);
    if(!err){
        Buy.findOneAndUpdate({
          _id: req.body.loanId,
          expired: false
        }, {
          $push:{
            bid: doc._id
          }   
        }, (err, resp) => {
          if(!err) {
            res.send({"status":"y","info":"bid submitted successfully",doc:doc});
          } else {
            console.log(err)
            res.send({"status":"n","info":"mongo error"})
          }
        })
    } else {
      console.log(err);
      res.send({"status":"n","info":"mongo error"})
    }
    
})

  
})

router.post('/loan/approve', (req, res, next) => {
  const loanId = req.body.loanId;
  const lenderId = req.body.lenderId;
  Buy.findByIdAndRemove(loanId, (err, loan) => {
    const dueAmount = parseInt(loan.amount + (loan.amount*loan.duration*loan.interest)/(100*365));
    Loans.create({
      lenderId: lenderId,
      borrowerId: loan.user,
      loanId: loan._id,
      amount: loan.amount,
      dueAmount,
      interest: loan.interest,
      duration: loan.duration,
      installment: loan.installment
    }, (err, result) => {
      for(let i=0; i<loan.bid.length; i++) {
        console.log(loan.bid[i]);
        Sell.findByIdAndRemove(loan.bid[i])
      }
      Reputation.findOne({
        userId: loan.user
      }, (err, user) => {
        const updatedReputation = user.creditScore - 20;
        Reputation.findOneAndUpdate({
          userId: loan.user
        }, {
          creditScore: updatedReputation
        }, (err, result) => {
          if(!err) {
            res.send({"status": "y", "info": "Loan has been processed."})
          } else {
            res.send({status: "n", "info": "mongo error", err});
          }
        })
      })
    })
  })
})

router.post('/bid/approve', (req, res, next) => {
  const bidId = req.body.bidId;
  console.log(bidId)
  Sell.findByIdAndRemove(bidId, (err, bid) => {
    console.log(err, bid)
    const loanId = bid.loanId;
    Buy.findByIdAndRemove(loanId, (err, loan) => {
      const dueAmount = parseInt(bid.amount + (bid.amount*bid.duration*bid.interest)/(100*365));
      Loans.create({
        lenderId: bid.lenderId,
        borrowerId: loan.user,
        loanId: loan._id,
        amount: bid.amount,
        dueAmount,
        interest: bid.interest,
        duration: bid.duration,
        installment: bid.installment
      }, (err, result) => {
        for(let i=0; i<loan.bid.length; i++) {
          console.log(loan.bid[i]);
          Sell.findByIdAndRemove(loan.bid[i])
        }
        Reputation.findOne({
          userId: loan.user
        }, (err, user) => {
          const updatedReputation = user.creditScore - 20;
          Reputation.findOneAndUpdate({
            userId: loan.user
          }, {
            creditScore: updatedReputation
          }, (err, result) => {
            if(!err) {
              res.send({"status": "y", "info": "Loan has been processed."})
            } else {
              res.send({status: "n", "info": "mongo error", err});
            }
          })
        })
      })
    })
  })
})

router.post('/bid/reject', (req, res, next) => {
  const bidId = req.body.bidId;
  console.log(bidId)
  Sell.findById(bidId, (err, bid) => {
    console.log(err, bid)
    const loanId = bid.loanId;
    Buy.findByIdAndUpdate(loanId, {
      $pull: {
        bid: bidId
      }
    },(err, loan) => {
      Sell.findByIdAndRemove(bidId, (err, result) => {
        if(!err) {
          res.send({status: "y", "info": "Bid Rejected"});
        } else {
          console.log(err);
          res.send({status: "n", "info": "Mongo error"});
        }
      })
    })
  })
})

router.post('/loan/repay', (req, res, next) => {
  const loanId = req.body.loanId;
  const repayAmount = req.body.repayAmount;
  Loans.findById(loanId, (err, loan) => {
    if(!err) {
      if(loan.dueAmount > repayAmount) {
        console.log("paying isntallment")
        Loans.findByIdAndUpdate(loanId, {
          dueAmount: loan.dueAmount - repayAmount
        }, (err, loan) => {
          if(!err) {
            res.send({status: 'y', info: "Amount credited successfully"});
          } else {
            res.send({status: 'n', info: "open loan not updated"});      
          }
        }) 
      } else {
        console.log("closing loan "+loan.borrowerId)
        Reputation.findOne({
          userId: loan.borrowerId
        }, (err, user) => {
          if(!err) {
            let updatedReputation = user.creditScore + 40;
            Reputation.findOneAndUpdate({
              userId: loan.borrowerId
            }, { creditScore: updatedReputation }, (err, user) => {
              if(!err) {
                Loans.findByIdAndUpdate(loanId, {
                  dueAmount: 0,
                  isClosed: true
                }, (err, loan) => {
                  res.send({status: 'y', info: "Amount credited successfully"});
                })
              } else {
                res.send({status: 'n', info: "err2"})
              }
            })
          } else {
            res.send({status: 'n', info: "err1"});      
          }
        })
      }
    } else {
      res.send({status: 'n', info: "open loan not found"});
    }
  })
})

router.post('/loan/open', (req, res, next) => {
  const loanId = req.body.loanId;
  Loans.findById(loanId, (err, loan) => {
    if(!err) {
      res.send({status: 'y', info: "loan retrieved", loan});
    } else {
      res.send({status: 'n', info: "mongo error"});
    }
  })
})

router.post('/loan/open/list', (req, res, next) => {
  const userId = req.body.userId;
  Loans.find({
    $or: [{
      borrowerId: userId
    }, {
      lenderId: userId
    }],
    isClosed: false
  }, (err, openLoans) => {
    if(!err) {
      res.send({status: 'y', info: "list retrieved", openLoans});
    } else {
      res.send({status: 'n', info: "mongo error"})
    }
  })
})

router.post('/loan/closed/list', (req, res, next) => {
  const userId = req.body.userId;
  Loans.find({
    $and: [{
      $or: [{
        borrowerId: userId
      }, {
        lenderId: userId
      }]
    }, {
      isClosed: true
    }],
  }, (err, closedLoans) => {
    if(!err) {
      res.send({status: 'y', info: "list retrieved", closedLoans});
    } else {
      res.send({status: 'n', info: "mongo error"})
    }
  })
})

router.post('/loan/bids', (req, res, next) => {
  Buy.findById(req.body.loanId)
      .populate('bid')
      .exec(function(err,data){
          console.log(err);
          res.send(data);
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