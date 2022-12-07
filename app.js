const express = require("express");
const app = express();
const morgan = require('morgan');

const tourRoute = require('./routes/tourRoutes');
const userRoute = require('./routes/userRoutes');

//===============| MiddelWare |=================//
app.use((req,res,next)=>{
    console.log('============MiddelWare===========')
    next();
})
app.use(morgan('dev'));
app.use(express.json());


//=============================================//


app.use('/api/v1/tours',tourRoute);
app.use('/api/v1/users',userRoute)

module.exports = app