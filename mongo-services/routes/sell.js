var express = require('express');
var router = express.Router();
var Sell = require('../models/mongo.config.sell');
var Buy = require('../models/mongo.config.buy')


router.get('/list',function(req,res,next){
  Buy.findById("5af70a29ce0be56223566a88")
      .populate('bid')
      .exec(function(err,data){
          console.log(err);
          res.send(data.bid)
      })
})

router.get('/', function(req, res, next) {
  console.log("Sell/")
  Sell.create({
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
        if(err !=null){
          console.log(err)
          console.log(doc)
          res.send({"status":"n","info":"mongo error"})
        }else{
          Buy.findOneAndUpdate({
              user: "Akshay",
              expired: false
            },{
              $push:
              {
                bid:doc._id
              }
            },{
              new: true
            },
            function(err,doc){
              console.log(err)
              res.send({"status":"y","info":"request created successfully"});
            }
          )          
        }
      }      
  )
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