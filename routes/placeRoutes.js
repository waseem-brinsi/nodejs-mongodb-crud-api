const express = require('express');
const  app = express();

const placeController = require('../controller/placeController');
const authController = require('../controller/authController');

const router = express.Router();
// router.param('id',placeController.checkId)

router
    .route('/')
    .get(authController.protect,placeController.getallplaces)
    .post(placeController.createplace)
router
    .route('/:id')
    .get(placeController.getplace)
    .patch(placeController.updateplace)
    .delete(
        authController.protect,
        authController.restrictTo("admin"),
        placeController.deleteplace)
    
module.exports = router;