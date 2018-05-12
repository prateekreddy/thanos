var express = require('express');
var router = express.Router();
var axios = require('axios');

var inputSanitate = require('../lib/validation')
var Buy = require('../models/mongo.config.buy');

var contractService = ""

router.get('/list',function(req,res){
    Buy.find({}).sort({amount:1}).exec(function(err,docs){
        res.send(docs)
    })
})

router.post('/', function(req, res, next) {
   if(inputSanitate(req.body,["user","contract","pubkey","amount","interest","duration","installments"])){
    axios.get('/user?id='+req.body.user).then(function(response){
        if(req.body.contract == response){
            Buy.create({
                nonce:req.body.nonce,
                user:req.body.user,
                contract:req.body.contract,
                pubkey: req.body.pubkey,
                amount:req.body.amount,
                duration: req.body.duration,
                interest:req.body.amount,
                signature:req.body.signature,
                updated:req.body.updated
              },function(err,doc){
                  if(err !=null){
                    console.log(err)
                    res.send({"status":"n","info":"mongo error"})
                  }else{
                    res.send({"status":"y","info":"request created successfully"});
                  }
                  
              })            
        }else{
            res.send({"status":"n","info":"contract address mismatch"})
        }
    })
   }else{
       res.send({"status":"n","info":"missing inputs"})
   }
});

router.post('/update', function(req, res, next) {
    if(inputSanitate(req.body,["user","contract","pubkey","amount","interest","duration","installments"])){
     axios.get('/user?id='+req.body.user).then(function(response){
         if(req.body.contract == response){
             Buy.findOneAndUpdate({
                user:req.body.user,
                expired: false
            },
            {
                duration: req.body.duration,
                amount:req.body.amount,
                interest:req.body.amount,
                signature:req.body.signature,
                updated:req.body.updated,
            })            
         }else{
             res.send({"status":"n","info":"contract address mismatch"})
         }
     })
    }else{
        res.send({"status":"n","info":"missing inputs"})
    }
 });
 
 router.post('/confirm',function(req,res,next){
    if(inputSanitate(req.body,["user","contract","pubkey","amount","interest","duration","installments"])){
        axios.get('/user?id='+req.body.user).then(function(response){
            if(req.body.contract == response){
                Buy.findOneAndUpdate({
                   user:req.body.user,
                   expired: false
               },
               {
                   expired: true
               })            
            }else{
                res.send({"status":"n","info":"contract address mismatch"})
            }
        })
       }else{
           res.send({"status":"n","info":"missing inputs"})
       }
 })
module.exports = router;
