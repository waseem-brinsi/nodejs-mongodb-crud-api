const hotel = require('../models/hotelModels')


exports.getallhotels = async (req,res)=>{
    try{
        //deleting unused param
        let objectquery = {...req.query}
        const deletedElement = ['page','sort','limit','fields']
        deletedElement.forEach((el)=>{delete objectquery[el]})
        //replacing gte with $gte
        objectquery = JSON.stringify(objectquery)
        objectquery= objectquery.replace(/\b(gte|lte)\b/g,match=>`$${match}`);
        console.log(req.query);
        console.log(objectquery);
        objectquery = JSON.parse(objectquery)

        let query =  hotel.find(objectquery)

        //3) sort
        if(req.query.sort){
            sort = req.query.sort.split(',').join(' ')
            query.sort(sort)
        }
        else{
            query.sort("id")
        }
        // .where('duration').gte(duration_gte)
        // .where('difficulty').equals('easy')
        // .where('price').lte(price_gte)

        //4)select by fields
        console.log(req.query);
        if(req.query.fields){        
            const fields = req.query.fields.split(',').join(' ')
            query.select(fields)
        }
        //5) pagination
        if(req.query.page){
            page = Number(req.query.page);
            limit = Number(req.query.limit);
            skip = (page - 1) * limit;
            query = query.skip(skip).limit(limit)
        }


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