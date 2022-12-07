const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const userschema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'user must have name']
    },
    email:{
        type:String,
        required:[true,'user must have email'],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,'invalid email']
    },
    photo:{
        type:String
    },
    role:{
        type: String,
        required:true,
        enum: ['user','admin','guide','lead_guide'],
        default: 'user'
    },
    password:{
        type:String,
        required:[true,'user must have password'],
        minlength:8,
        select:false
    },
    passwordConfirm:{
        type:String,
        required:[true,'user must have password comfirmation'],
        validate:{
            validator:function(el){
                return el === this.password
            },
            massage:'confirm the password please'
        }
    },
    PasswordchangedAt:{type:Date},
    PasswordRestToken:{type:String},
    PasswordRestExpire:{type:Date},
    active:{
        type:Boolean,
        default:true,
        select:false,
    }
})

userschema.pre(/^find/,function(next){

    this.find({active:{$ne:false}})
    next()
});

userschema.pre('save',async function (next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,12)

    this.passwordConfirm = undefined
    next()
})
userschema.pre('save',function(next){
    if(!this.isModified('password')) return next();
    this.PasswordchangedAt = Date.now()-1000;
    next();
})
userschema.methods.comparPassword = async function(loginpassword,userpassword){
    return await bcrypt.compare(loginpassword,userpassword)
}

userschema.methods.isPasschanged =  function(tokenIat){
    if (Number(this.changedAt)/1000 > tokenIat){
        return true
    }
    return false
}
userschema.methods.createPasswordRestToken = function(){
    const restToken = crypto.randomBytes(32).toString('hex');
    this.PasswordRestToken= crypto
        .createHash('sha256')
        .update(restToken)
        .digest('hex');

    this.PasswordRestExpire = Date.now() + 10 * 60 * 1000;
    console.log(restToken,this.PasswordRestToken);
    return restToken
}
const user = mongoose.model('user',userschema)

module.exports = user