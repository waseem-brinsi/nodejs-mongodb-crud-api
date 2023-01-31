const hotel = require('../models/hotelModels')


exports.getallhotels = async (req,res)=>{
    try{
        let query =  place.find(req.query)
        const hotels = await query

        res.status(200).json( hotels)
    }catch(err){
        res.status(200)
        .json({
            status:"faild",
            error:err
        })}
}
exports.createhotel = async (req,res)=>{
    try{
        const newhotel = await hotel.create(req.body)
        res.status(200).json(newhotel)
    }catch(err){
        res.status(400).json(
            {
                status:"faild",
                error:err
            }
        )
    }
}
exports.gethotel = async (req,res)=>{
    try{
        const findhotel =await  hotel.findById(req.params.id) 
        // const findhotel =await  hotel.findOne({_id:req.params.id}) 
        res.status(200).json({
        status:"seccuss",
        data:findhotel
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
exports.updatehotel = async (req,res)=>{
    try{
        const updatehotel = await hotel.findByIdAndUpdate(req.params.id,req.body,{
                                                                                new:true,
                                                                                runValidators:true    })
        res.status(200).json({
            
            data:updatehotel
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
exports.deletehotel =async (req,res)=>{
    try{
        await hotel.findByIdAndDelete(req.params.id)
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