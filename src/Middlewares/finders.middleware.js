import { ErrorHandleClass } from "../utils/error-class.utils.js";




export const checkDocumentByName = (model)=>{
    return async (req,res,next)=>{
        const { name } = req.body;
        if(name){
        const document = await model.findOne({name})
        if(document){
            return next(new ErrorHandleClass("this name is exist",400))
        }
    }
        next();
    } 
}

//request Ids
export const checkIfIdsExist = (model)=>{
    return async (req,res,next)=>{
        const {categoryId,subCategoryId,brandId}= req.query      
        const document = await model.findOne({
        _id:brandId,
        categoryId:categoryId,
        subCategoryId:subCategoryId
        }).populate([
        {path:"categoryId" , select:"customId"},
        {path:"subCategoryId" , select:"customId"}
    ])
            if(!document){
                return next(new ErrorHandleClass(`${model.modelName} is not exist`,404))
            }
        req.document = document
        next();
    }
}


