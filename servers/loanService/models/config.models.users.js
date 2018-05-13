const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

const userSchema = new Schema({
    name:{
        type: String,
        required:true,
    },
    phoneNumber:{
        type: Number,
        required:true,
        unique: true
    },
    password:{
        required: true,
        type: String
    },
    contractAddress: {
        required: true,
        type: String
    }
},{collection: "users"});

module.exports = mongoose.model('user', userSchema);
