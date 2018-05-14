const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

const sellSchema = new Schema({
    roomId:{
        type:String,
        required:true,
    },
    messages:{
        type:String,
        required:true,
    }
},{collection: "chatRoom"})

module.exports = mongoose.model('chatRoom', sellSchema);
