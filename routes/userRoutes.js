const express = require('express');
const app = express();

const userController = require('./../controller/userController');
const authController = require('./../controller/authController');


//--Routing Users------//
const router = express.Router()

router.post('/signup',authController.signup)
router.post('/login',authController.login)

//sending link with token to restpassword 
router.post('/forgetPassword',authController.forgetPassword)
router.patch('/restPassword/:RestToken',authController.restPassword)

//update login_user password 
router.route('/updatePassword')
      .patch(authController.protect,authController.updatePassword)

router.patch('/updateMe',authController.protect,userController.updateMe)

router.delete('/deleteMe',authController.protect,userController.deleteMe)


router
    .route('/')
    .get(userController.getalluser)
    .post(userController.createuser)
router
    .route('/:id')
    .get(userController.getuser)
    .patch(userController.updateuser)
    .delete(userController.deleteuser)

module.exports = router;