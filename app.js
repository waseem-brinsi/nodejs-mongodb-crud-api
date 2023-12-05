const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const multer = require('multer');


const hotelRoute = require('./routes/hotelRoutes');
const placeRoute = require('./routes/placeRoutes');
const userRoute = require('./routes/userRoutes');

//===============| MiddelWare |=================//
app.use((req,res,next)=>{
    console.log('============MiddelWare===========')
    next();
})
app.use(express.json());                       //this is the build in express body-parser 
app.use(express.urlencoded({extended: true,}));                //this mean we don't need to use body-parser anymore



  

app.use(morgan('dev'));

app.use("/img",express.static('dev-data/img'))

//=======================================| Upload Image |=================================================================//
const storage = multer.diskStorage({
    destination: 'dev-data/img',
    filename: function (req, file, cb) {
      cb(null,`${Date.now()}_${file.originalname}`);
    }
  });
const upload = multer({storage: storage});  // specify the destination directory for uploaded images

app.post('/api/v1/upload', upload.single('image'), (req, res) => {
    console.log(req.file)
    //res.send('Image uploaded successfully')
    res.json(
        {
            filename : req.file.filename,
            image_Url : `${req.protocol}://${req.get('host')}/img/${req.file.filename}`
        }
    )
});
//=====================================================================================================================//


app.use('/hotels',hotelRoute)
app.use('/places',placeRoute)
app.use('/users',userRoute)

module.exports = app