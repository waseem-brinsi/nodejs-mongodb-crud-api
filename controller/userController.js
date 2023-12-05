const user = require('./../models/userModels')

const filterObj = function(obj,...allowedFields){
    let newObject = {}
            for(element in obj){
                if(allowedFields[0].includes(element)){
                    newObject[element]=obj[element]
                }
            }
    return newObject
}


exports.getalluser = async (req,res)=>{
    try{
        param =req.query
        const alluser = await user.find(param)    
        res.status(200).json(
            //status:alluser.length,
            alluser
        )
        }catch(err){
        res.status(500).json({status:'faild',error:err})
    }
}

exports.getalluser = async (req,res)=>{
    try{
        console.log('level 0');
        param =req.query
        console.log('level 1');
        const alluser = await user.find(param)    
        console.log('level 2');
        res.status(200).json(
            //status:alluser.length,
            alluser
        )
        }catch(err){
        res.status(500).json({status:'faild',error:err})
    }
}

exports.createuser = (req,res)=>{
    res.status(500).json(
        {
            status:'seccuss',
            data:'feature not difined yet'
        }
    )
}


exports.getuser = (req,res)=>{
    res.status(500).json(
        {
            status:'seccuss',
            data:'feature not difined yet'
        }
    )
}

exports.updateuser = (req,res)=>{
    res.status(500).json(
        {
            status:'seccuss',
            data:'feature not difined yet'
        }
    )
}

exports.deleteuser = (req,res)=>{
    res.status(500).json(
        {
            status:'seccuss',
            data:'feature not difined yet'
        }
    )
}

exports.updateMe =async function(req,res){
    // 1) Create Error if POST passwor update
        if(req.body.password || req.body.passwordConfirm){
            return res.status(500).json
            ({
                status:'faild',
                message:"you can't update your password use /updatePassword"
            })
        }

        // 2) update user document
        const filteredBody = filterObj(req.body,["name","email"])
        const updateUser = await user.findByIdAndUpdate(req.user.id,filteredBody,{new:true,runValidators:true})
        await updateUser.save({validateBeforeSave: false});
        console.log("level 1");
         res.status(200).json
            ({
                status:'success',
                message:"user updated "
            })
}

exports.deleteMe = async function(req,res){
    currentUser = await user.findByIdAndUpdate(req.user.id,{active:false})
    // await currentUser.save()

    res.status(200).json({
        status : 'success',
        data : null
    })
}