const express = require("express");
const app = express();
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
app.use(morgan('dev'));
app.use(express.json());
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


app.use('/api/v1/hotels',hotelRoute)
app.use('/api/v1/places',placeRoute)
app.use('/api/v1/users',userRoute)

module.exports = app