const Place = require('../models/placeModels')


exports.getallplaces = async (req,res)=>{
    try{
        let query =   Place.find(req.query)
        const AllPlaces = await query
        res.status(200).json(AllPlaces)
    }catch(err){
        res.status(200).json({
            status:"faild",
            error:err
        })}
}

exports.createplace = async (req,res)=>{
    try{
        const newplace = await Place.create(req.body)
        res.status(200).json(newplace)
    }catch(err){
        res.status(400).json(
            {
                status:"faild",
                error:err
            }
        )
    }
}

exports.getplace = async (req,res)=>{
    try{
        const findplace =await  Place.findById(req.params.id) 
        // const findplace =await  place.findOne({_id:req.params.id}) 
        res.status(200).json({
        status:"seccuss",
        data:findplace
    });
    }catch(err){
        res.status(400).json(
            {
                status:"faild",
                error:err
            }
        )
    }
}

exports.updateplace = async (req,res)=>{
    try{
        const updateplace = await Place.findByIdAndUpdate(req.params.id,req.body,{
                                                                                new:true,
                                                                                runValidators:true    })
        res.status(200).json({
            
            data:updateplace
        });
    }catch(err){
        res.status(404).json(
            {
                status:"faild",
                error:err
            }
        )
    }
}

exports.deleteplace =async (req,res)=>{
    try{
        await Place.findByIdAndDelete(req.params.id)
        res.status(200).json({
            status:"seccuss",
            data:null
        });
    }catch(err){
        res.status(404).json(
            {
                status:"faild",
                error:err
            }
        )
    }
}
