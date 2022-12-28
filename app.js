const express = require("express");
const app = express();
const morgan = require('morgan');

const placeRoute = require('./routes/placeRoutes');
const userRoute = require('./routes/userRoutes');

//===============| MiddelWare |=================//
app.use((req,res,next)=>{
    console.log('============MiddelWare===========')
    next();
})
app.use(morgan('dev'));
app.use(express.json());

app.use("/img",express.static('dev-data/img'))

//=============================================//


app.use('/api/v1/places',placeRoute);
app.use('/api/v1/users',userRoute)

module.exports = app