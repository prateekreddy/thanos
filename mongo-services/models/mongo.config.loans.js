const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

const loansSchema = new Schema({
    lenderId:{
        type:String,
        required:true
    }, 
    borrowerId: {
        type:String,
        required:true 
    },
    loanId: {
        type: String,
        required: true
    },
    amount: {
        type:Number,
        required: true
    },
    dueAmount: {
        type: Number,
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
    isClosed: {
        type: Boolean,
        default: false
    },
    updated:{
        type: Date,
        default: Date.now
    }
},{collection: "loans"})

module.exports = mongoose.model('loans', loansSchema);