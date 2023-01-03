const express = require('express');
const  app = express();

const hotelController = require('../controller/hotelController');
const authController = require('../controller/authController');

const router = express.Router();
// router.param('id',hotelController.checkId)

router
    .route('/')
    .get(authController.protect,hotelController.getallhotels)
    .post(hotelController.createhotel)
router
    .route('/:id')
    .get(hotelController.gethotel)
    .patch(hotelController.updatehotel)
    .delete(
        authController.protect,
        authController.restrictTo("admin"),
        hotelController.deletehotel)
    
module.exports = router;