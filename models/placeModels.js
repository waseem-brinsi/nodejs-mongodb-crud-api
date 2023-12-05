const mongoose = require('mongoose')

const placeschema = new mongoose.Schema({
    name:{
        type:String,
        require:[true,'A place must have name'],
        unique: true,
        trim:true
    },
    description:{
        type:String,
        required:[true,'a place must have description'],
        trim:true
    },
    rating:{
        type:String,
        default:"0.0"
    },
    image:{
        type:String,
        required:[false,'a place must have description']
    }
});
place = mongoose.model('place',placeschema)
module.exports = place