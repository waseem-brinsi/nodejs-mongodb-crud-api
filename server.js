const app = require('./app')


const tour = require('./models/placeModels')
const mongoose = require('mongoose')





const hostname = "localhost";
const port=8000;  
//const mongo_db_url ='mongodb://mongo_db:27017/natours_db_docker' 
const mongo_db_url ='mongodb://127.0.0.1:27017/tripy_db' 
mongoose.connect(mongo_db_url,{
        useNewUrlParser :true,
         useCreateIndex :true,
        useUnifiedTopology:true,
        useFindAndModify :false,
        }).then(()=>console.log(`connected to database successful ${mongo_db_url}` ))
            .catch((err)=>{
                console.log("connection faild try again to database");
                console.log(err)
        })




                        
app.listen(port,()=>{                       
    //console.log(`app run in port ${port}`); 
    console.log(`Server running at http://${hostname}:${port}/`);
})                                          
