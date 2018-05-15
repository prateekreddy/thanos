var express = require('express');
var router = express.Router();
var axios = require('axios');

var inputSanitate = require('../lib/validation').inputSanitate
var Buy = require('../models/mongo.config.buy');

var contractService = "http://10.200.208.43:8000"

router.post('/list',function(req,res){
    Buy.find({
        expired:false
        // $not:{
        //     userId:req.body.userId
        // }
    }).sort({amount:1}).exec(function(err,docs){
        res.send(docs)
    })
})

router.post("/count",function(req,res,next){
    if(inputSanitate(req.body,["user"])){
        Buy.count({user:req.body.user,expired:false},function(err,count){
            res.send({"status":"y","info":count})
        })
    }else{
        res.send({"status":"n","info":"User doesnt exists"})
    }
})

router.post("/loan",function(req,res,next){
    if(inputSanitate(req.body,["user"])){
        Buy.findOne({user:req.body.user,expired:false},function(err,doc){
            console.log(err)
            console.log(doc)
            res.send({"status":"y","doc":doc})
        })
    }else{
        res.send({"status":"n","info":"User doesnt exists"})
    }
})

router.post('/', function(req, res, next) {
   if(inputSanitate(req.body,["user","contract","pubkey","amount","interest","duration","installment"])){
       Buy.count({user:req.body.user,expired:false},function(err,count){
        console.log(err)
        console.log(count)
        if(count < 1){
            Buy.create({
                nonce:req.body.nonce,
                user:req.body.user,
                contract:req.body.contract,
                pubkey: req.body.pubkey,
                amount:req.body.amount,
                duration: req.body.duration,
                interest:req.body.interest,
                signature:req.body.signature,
                updated:req.body.updated,
                installment: req.body.installment
            },function(err,doc){
                if(err !=null){
                    console.log(err)
                    res.send({"status":"n","info":"mongo error"})
                }else{
                    res.send({"status":"y","info":"request created successfully",doc:doc});
                }
                
            })
        }else{
            res.send({"status":"n","info":"Pending loan already exists"})
        }
       })
   }else{
       res.send({"status":"n","info":"missing inputs"})
   }
});

router.post('/update', function(req, res, next) {
    if(inputSanitate(req.body,["user","contract","pubkey","amount","interest","duration","installment"])){
        Buy.findOneAndUpdate({
            user:req.body.user,
            expired: false
        },
        {
            duration: req.body.duration,
            amount:req.body.amount,
            interest:req.body.interest,
            signature:req.body.signature,
            updated:req.body.updated,
            installment: req.body.installment
        },{new:false},function(err,doc){
            console.log(err)
            console.log(doc)
            res.send({"status":"y","doc":doc})
        }).catch(function(err){
            console.log(err)
        })
    }else{
        res.send({"status":"n","info":"missing inputs"})
    }
 });
 
 router.post('/confirm',function(req,res,next){
    if(inputSanitate(req.body,["user","contract","pubkey","amount","interest","duration","installment"])){
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
