const User = require('./../models/userModels')
const jwt = require('jsonwebtoken')
const sendEmail = require('./../utils/email')
const crypto = require('crypto')
const bcrypt = require('bcrypt')

const signToken = function(id){
    return jwt.sign({id},'wetcci-secret',{
        expiresIn:'90d'
    })
}
const sendToken = function(user,status,res){
    const token = signToken(user._id);
    res.status(status).json({
        email:user.email,
        token:token
    })
}


exports.signup = async (req,res)=>{
    try{
        console.log(req.body.name);
        const newUser = await User.create(
            {
                name : req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                password: req.body.password,
                passwordConfirm : req.body.passwordConfirm
            }
        )
        console.log(newUser);
        const token = signToken(newUser._id)
        //response
        res.status(200).json({
            status:"seccuss",
            token:token,
            data:newUser
        })
    }
    catch(err){
        res.status(400).json(
            {
                status:"faild",
                error:err
            }
        )
    }
}

exports.login = async function(req,res,next){
    try{
        const LoginEmail = req.body.email
        const LoginPassword = req.body.password
        // 1- check if the email and password exist
        if(!LoginEmail || !LoginPassword ){
           return res.status(400).json({status:"faild",error:"empty passwor and email"})
        }
        //2- check if user exist & password Correct
       const FindUser = await User.findOne({email:LoginEmail}).select('+password');
       const comparPassword = await FindUser.comparPassword(LoginPassword,FindUser.password)

       //3- if ervrything ok send token to the user
        if(FindUser && comparPassword){
            console.log("Login seccuss ");
            const token = signToken(FindUser._id);
            res.status(200).json({
                email:FindUser.email,
                token:token,
                
            })
        }
        else{
            console.log("Login Faild ");
            return res.status(400).json({status:"faild",error:"Incorrect Email or Password"})
        }
       }
       catch(err){
        console.log(err)
        return res.status(400).json({status:"faild",error:"unknown error"})
       }
}

//check if the user login and have token
exports.protect = async (req,res,next)=>{
    let token;
    let decode;
    // 1) get token and check if it's there
    try{        
        if(req.headers && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1]
        }
        if(!token){return next(res.status(400).json({status:"No token"}))}
    }
    catch(err){ return next(res.status(400).json({status:"faild",error:'No authorization'}))}
    
    // 2) verification token:
    try{
        decode = await jwt.verify(token, 'wetcci-secret');
    }
    catch(err){return res.status(400).json({status:"faild",error:err})}

    // 3) check if user exist using token id:
    const currentUser = await User.findById(decode.id)
    if(!currentUser){
        return res.status(400).json({status:"faild",error:"user not exist"})
    }

    // 4) check if user changed password after the token was issued:
    const isPasschanged = currentUser.isPasschanged(decode.iat)
    if(isPasschanged){
        return res.status(400).json({status:"faild",error:"Password Changed --- try again with the new PassWord "})
    }
    console.log(req.user);
    req.user = currentUser
    console.log(req.user);

    next()
}    

exports.restrictTo =  function(...roles){
    return function(req,res,next){
        if(!roles.includes(req.user.role)){
            return res.status(400).json({status:"faild",error:"You don't have the permission to perform the action"})
        }
        next()
    }
}

exports.forgotPassword =async function(req,res,next){

    // 1) get random user based on Post email:
    console.log("Find the email if exist");
    const email = req.body.email
    const currentuser = await User.findOne({email:email});
    console.log(currentuser);
    if(!email){
        res.status(400).json({
        status:"failed",
        message:"email or user not exist"
    })
    }
    
    // 2) generate the random reset token:
    console.log("...Generate random token...");
    const CodeReset = currentuser.generateCodeReset()
    const RestToken = currentuser.createPasswordRestToken()
    await currentuser.save({validateBeforeSave: false})

    // 3) Send it to user's email:
    console.log("...Send it to the mail...")
    resetURL=`${req.protocol}://${req.get('host')}/api/v1/users/restPassword/${RestToken}`
    const message = `
    Reset Code for Mobile ${CodeReset}
    click the link to reset your password => ${resetURL}`
    try{
    await sendEmail({
        email:  currentuser.email,
        subject:'password reset token',
        message,
    });
    res.status(200).json({
        status:"success",
        message:"email send"
    })
    }catch(err){
        console.log(err);
        currentuser.PasswordRestExpire = undefined,
        currentuser.RestToken = undefined,
        await currentuser.save({validateBeforeSave: false})
    }
    next()

}


exports.restPassword = async function(req,res,next){ 

    // 1) get user based on the token
    RestToken = req.params.RestToken
    console.log(RestToken);
    PasswordRestToken = crypto.createHash('sha256').update(RestToken).digest('hex');
    const currentuser = await User.findOne({
        PasswordRestToken:PasswordRestToken,
        PasswordRestExpire:{$gt:Date.now()}
    })
    if(!currentuser){
        console.log(currentuser);
        res.status(200).json({
            error:"Token is invalid or has expired"
        })
    }
    console.log(currentuser);
    console.log("level 1");
    // 2) if token has not exprired, and there is user, set the new password
    currentuser.password = req.body.newPassword ;
    currentuser.passwordConfirm = req.body.confirmNewPassword;
    currentuser.PasswordRestExpire = undefined;
    currentuser.PasswordRestToken = undefined;
    console.log("level 2");
    await currentuser.save({validateBeforeSave: false});
    // 3) Update changePasswordAt field properly for the user
    // 4) Log the user in , send JWT
    const token = signToken(currentuser._id)
    res.status(200).json({
        status:"success",
        token
    })
}


exports.resetCode = async function(req,res,next){
    try {
        
        // 1) get user based on the ResetCode
        ResetCode = req.params.ResetCode
        console.log(ResetCode);
        ResetCode = crypto.createHash('sha256').update(ResetCode).digest('hex');
        console.log(ResetCode);
        const currentuser = await User.findOne({
            ResetCode:ResetCode,
            ResetCodeExpire:{$gt:Date.now()}
        })
        if(!currentuser){
            console.log(currentuser);
            res.status(200).json({
                error:"ResetCode is invalid or has expired"
            })
        }
        console.log(currentuser);
        console.log("level 1");

        // 2) if ResetCode has not exprired, and there is user, set the new password
        currentuser.password = req.body.password ;
        currentuser.passwordConfirm = req.body.passwordConfirm;
        currentuser.PasswordRestExpire = undefined;
        currentuser.PasswordRestToken = undefined;
        console.log("level 2");
        await currentuser.save({validateBeforeSave: false});

        // 3) Update changePasswordAt field properly for the user
        // 4) Log the user in , send JWT
        const token = signToken(currentuser._id)
        res.status(200).json({
            status:"success",
            token
        })
        
    } catch (error) {
        console.log(error);
    }
}

exports.updatePassword = async function(req,res,next){
    // 1) get user from collection
    const currentUser = await User.findById(req.user.id).select('+password')
    // console.log(currentUser);
    // 2) check if the current password is correct:
    console.log(req.body.currentPassword);
    const test = await currentUser.comparPassword(req.body.currentPassword,currentUser.password)
    // 3) if so update the password
    if(!test){
        return res.status(400).json(
            {
                error:"password inccorect"
            }
        )
    }
    currentUser.password = req.body.newPassword;
    currentUser.passwordConfirm = req.body.confirmNewPassword;
    await currentUser.save();
    // 4) log user in ,send jwt
    sendToken(currentUser,200,res)
    next()
}