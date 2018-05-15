const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

const creditScoreSchema = new Schema({
    userId:{
        type:String,
        required:true,
    },
    creditScore:{
        type:Number,
        required:true,
    }
},{collection: "credit_score"})

module.exports = mongoose.model('creditScore', creditScoreSchema);