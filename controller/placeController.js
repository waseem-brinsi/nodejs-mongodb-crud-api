const place = require('../models/placeModels')


exports.getallplaces = async (req,res)=>{
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

        let query =  place.find(objectquery)

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


        const places = await query

        res.status(200).json( places)
    }catch(err){
        res.status(200)
        .json({
            status:"faild",
            error:err
        })}
}
exports.createplace = async (req,res)=>{
    try{
        const newplace = await place.create(req.body)
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
        const findplace =await  place.findById(req.params.id) 
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
        const updateplace = await place.findByIdAndUpdate(req.params.id,req.body,{
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
        await place.findByIdAndDelete(req.params.id)
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