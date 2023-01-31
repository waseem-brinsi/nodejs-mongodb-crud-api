const mongoose = require('mongoose')

const hotelschema = new mongoose.Schema({
    name:{
        type:String,
        require:[true,'A place must have name'],
        unique: true,
        trim:true
    },
    address:{
        type:String,
        required:[true,'a place must have address'],
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
        type:[String],
        required:[true,'a place must have description']
    }
});
hotel = mongoose.model('hotel',hotelschema)
module.exports = hotel