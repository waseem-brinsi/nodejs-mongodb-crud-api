const express = require('express');
const  app = express();

const tourController = require('./../controller/tourController');
const authController = require('./../controller/authController');

const router = express.Router();
// router.param('id',tourController.checkId)

router
    .route('/')
    .get(authController.protect,tourController.getalltours)
    .post(tourController.createtour)
router
    .route('/:id')
    .get(tourController.gettour)
    .patch(tourController.updateTour)
    .delete(
        authController.protect,
        authController.restrictTo("admin"),
        tourController.deleteTour)
    
module.exports = router;