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





/*
const mongoose = require('mongoose')

const tourschema = new mongoose.Schema({
    name:{
        type:String,
        require:[true,'A tour must have name'],
        unique: true,
        trim:true
    },
    duration:{
        type:Number,
        required:[true,'A tour must have duration']
    },
    maxGroupSize:{
        type:Number,
        required:[true,'A tour must have maxGroupSize']
    },
    difficulty:{
        type:String,
        require:[true,'A tour must have difficulty'],
    },
    ratingsAverage:{
        type:Number,
        required:[true,'A tour must have ratingsAverage']
    },
    ratingsQuantity:{
        type:Number,
        required:[true,'A tour must have ratingsQuantity']
    },
    rating:{
        type:Number,
        default:0.0
    },
    price: {
        type:Number,
        required:[true,'a tour must have price']
    },
    summary:{
        type:String,
        required:[true,'a tour must have summary'],
        trim:true
    },
    description:{
        type:String,
        required:[true,'a tour must have description'],
        trim:true
    },
    imageCover:{
        type:String,
        required:[true,'a tour must have imageCover'],
        trim:true
    },
    images:[String],
    createdAt:{
        type:Date,
        default:Date.now()
    },
    startDates:[Date]
});

tour = mongoose.model('tour',tourschema)

module.exports = tour

*/