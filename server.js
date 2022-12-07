const app = require('./app')


const tour = require('./models/tourModels')
const mongoose = require('mongoose')


const mongo_db_url ='mongodb://localhost:27017/natours_db' 
mongoose.connect(mongo_db_url,{
        // useNewUrlParser :true,
        useCreateIndex :true,
        // useFindAndModify :false,
        }).then(()=>console.log("connected to database successful"))
            .catch((err)=>{console.log("connection faild try again");})


const port=8000;                          
app.listen(port,()=>{                       
    console.log(`app run in port ${port}`); 
})                                          
