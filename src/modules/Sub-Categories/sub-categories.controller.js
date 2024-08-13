import slugify from "slugify"
import { nanoid } from "nanoid"
import { ErrorHandleClass ,cloudinaryConfig } from "../../utils/index.js"
import { Category, SubCategory , Brands } from "../../../DB/models/index.js"
/**
 * @api {POST} /sub-categories/create  create SubCategories
 */
export const createSubCategory = async(req,res,next)=>{
    //check category is exist 
    const {idForCategory} = req.query
    const category= await Category.findById(idForCategory)
    if(!category){
        return next(new ErrorHandleClass("category not found",404))
    }


    //request the data 
    const {name}= req.body
    
    //generate slug
    const slug = slugify(name,{
        replacement:'_',
        lower:true
    })

    //get the image
    if(!req.file){
        return next(new ErrorHandleClass("plz upload your image", 400))
    }
    //upload el image on cloudinary
    const customId = nanoid(4)
    const {secure_url , public_id} = await cloudinaryConfig().uploader.upload(req.file.path,{
        folder:`${process.env.UPLOADS_FOLDER}/categories/${category.customId}/sub-categories/${customId}`,  
    })
     //prepare subCategory object 
    const subCategory = {
        name,
        slug,
        Images:{
            secure_url,
            public_id,
        },
        customId,
        categoryId: category._id
    }
    //create subCategory in database
   const newSubCategory = await SubCategory.create(subCategory);

    //send response
    res.status(201).json({message:"subCategory created successfully" , newSubCategory});


}
/*=================================================================================================================================================*/ 
/**
 * @api {GET} /sub-categories/getSubCategory  get subCategories
 */
export const getSubCategory = async(req,res,next)=>{
    //request data
    const {name , id , slug} = req.query
    const queryFilter = {}
    //check the data and put it in object to use it
     if(name)queryFilter.name =name
     if(id)queryFilter._id=id
     if(slug)queryFilter.slug=slug

     //find subCategory in database
     const getSubCategory = await SubCategory.findOne(queryFilter)
     //check is the category not found
    if(!getSubCategory){
        return next(new ErrorHandleClass("no subCategory found", 404))
    }
    //send response 
    res.status(200).json({message:"your subCategory : " , getSubCategory})

}
/*=================================================================================================================================================*/ 
/**
 * @api {UPDATE} /sub-categories/updateSubCategory  update subCategories
 */
export const updateSubCategory = async(req,res,next)=>{
    //request the data
    const {_id}= req.params
    
    //find the category 
    const subCategory =await SubCategory.findById(_id).populate("categoryId")
    if(!subCategory){
        return next(new ErrorHandleClass("subCategory not found to update"))
    }
    //create slug to the name if the name exist
    const {name}= req.body
    if(name){
        const slug = slugify(name , {
            replacement:'_',
            lower:true,
        })
    //update  name , slug 
    subCategory.name=name
    subCategory.slug=slug
    }

    //update image 
    if(req.file){
        const splitPublicId = subCategory.Images.public_id.split(
            `${subCategory.customId}/`
        )[1];
        const {secure_url}=await cloudinaryConfig().uploader.upload(req.file.path,{
            folder:`${process.env.UPLOADS_FOLDER}/categories/${subCategory.categoryId.customId}/sub-categories/${subCategory.customId}`,
            public_id:splitPublicId,
        })

        subCategory.Images.secure_url=secure_url
    }
     //save the update
    await subCategory.save()
    //send response
    res.status(200).json({message:"subCategory is updated" , subCategory})
    
}
/*=================================================================================================================================================*/ 
/**
 * @api {DELETE} /sub-categories/deleteSubCategory  delete subCategories
 */
export const deleteSubCategory = async(req,res,next)=>{
    //request the data
    const {_id} = req.params
    //find and delete the data by id
    const subCategory = await SubCategory.findByIdAndDelete(_id).populate("categoryId")
    if(!subCategory){
        return next(new ErrorHandleClass("subCategory not found to delete", 400))
    }
    //get path this category’s image
    const subCategoryPath = `${process.env.UPLOADS_FOLDER}/categories/${subCategory.categoryId.customId}/sub-categories/${subCategory.customId}`
    //delete the image
    await cloudinaryConfig().api.delete_resources_by_prefix(subCategoryPath)
    //delete the folder
    await cloudinaryConfig().api.delete_folder(subCategoryPath)

    //delete relevant brands from database
    await Brands.deleteMany({subCategoryId:_id})
    //TODO delete relevent products from db

    //send response
    res.status(200).json({message:"delete is done ",subCategory})

}


