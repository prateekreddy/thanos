const mongoose = require('mongoose');
const Schema =  mongoose.Schema;
const isHex = require('is-hex')
const sha256 = require('sha256')

const sellSchema = new Schema({
    user:{
        type:String,
        required:true,
    },
    contract:{
        type:String,
        required:true,
    },
    nonce:{
        required: true,
        type: Number
    },
    pubkey: {
        type:String,
        required:true
    },
    amount: {
        type:Number,
        required: true
    },
    interest:{
        type:Number,
        required: true
    },
    duration:{
        type: Number,
        default:12
    },
    installment:{
        type: Number,
        default:12
    },
    expired: {
        type: Boolean,
        default: false
    },
    updated:{
        type: Date,
        default: Date.now
    },
    signature:{
        hash:{
            type:String,
            default :sha256(this._id+""+this.nonce+""+this.installment+""+this.interest+""+this.contract+""+this.amount+""+this.updated),
            validate:{
                validator:function(text){
                    if(isHex(text))
                    return text.length === 64

                    else
                    return false
                }
            }
        },
        version: {type:String, required :true,validate:{validator:function(text){
            if(isHex(text))
            return text.length == 2

            else
            return false
        }}},
        r: {type:String, required :true,validate:{validator:function(text){
            if(isHex(text))
            return text.length === 64

            else
            return false
        }}},
        s: {type:String, required :true,validate:{validator:function(text){
            if(isHex(text))
            return text.length === 64

            else
            return false
        }}}
    }

},{collection: "sell_request"})

module.exports = mongoose.model('Sell', sellSchema);
