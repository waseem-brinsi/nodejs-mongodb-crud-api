const tour = require('./../models/tourModels')


exports.getalltours = async (req,res)=>{
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

        let query =  tour.find(objectquery)

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


        const tours = await query

        res.status(200).json({
            resault:tours.length,
            status:"seccuss",
            data:{
                tours
            }
        })
    }catch(err){
        res.status(200)
        .json({
            status:"faild",
            error:err
        })}
}
exports.createtour = async (req,res)=>{
    try{
        const newtour = await tour.create(req.body)
        res.status(200).json(
            {
                status:"seccuss",
                data:{
                    newtour
                }
            }
        )
    }catch(err){
        res.status(400).json(
            {
                status:"faild",
                error:err
            }
        )
    }



}
exports.gettour = async (req,res)=>{
    try{
        const findtour =await  tour.findById(req.params.id) 
        // const findtour =await  tour.findOne({_id:req.params.id}) 
        res.status(200).json({
        status:"seccuss",
        data:findtour
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
exports.updateTour = async (req,res)=>{
    try{
        const updatetour = await tour.findByIdAndUpdate(req.params.id,req.body,{
                                                                                new:true,
                                                                                runValidators:true    })
        res.status(200).json({
            
            data:updatetour
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
exports.deleteTour =async (req,res)=>{
    try{
        await tour.findByIdAndDelete(req.params.id)
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