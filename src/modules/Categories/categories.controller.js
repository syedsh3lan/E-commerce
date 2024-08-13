
import slugify from "slugify";
import { nanoid } from "nanoid";
import { ErrorHandleClass ,cloudinaryConfig } from "../../utils/index.js";
import { Brands, Category , SubCategory } from "../../../DB/models/index.js";
/**
 * @api {POST} /categories/create  create categories
 */
export  const createCategory =async(req ,res , next)=>{
    //request the data 
    const {name}= req.body;
    //generate slug 
    const slug = slugify(name , {
        replacement : '_',
        lower : true,
    })

    //get the image
    if(!req.file){
        return next(new ErrorHandleClass("plz upload your image", 400))
    }

    //upload image to cloudinary
    const customId = nanoid(4)
    const {secure_url , public_id}= await cloudinaryConfig().uploader.upload(req.file.path,{
        folder : `${process.env.UPLOADS_FOLDER}/categories/${customId}`,

    });

    //prepare category object 
    const category = {
        name,
        slug,
        Images:{
            secure_url,
            public_id,
        },
        customId,
    };

    //create category in database
    const newCategory = await Category.create(category)

    //send response
    res.status(201).json({message:"category created successfully" , newCategory});
}
/*================================================================================================================================================*/
/**
 * @api {GET} /categories/getCategory  get categories
 */
export const getCategory = async (req,res,next)=>{
    //request the data
    const{id,name,slug}= req.query
    const queryFilter = {}
    //check the data and put it in object to use it
    if(id)queryFilter._id=id
    if(name)queryFilter.name=name
    if(slug)queryFilter.slug=slug
    //find category in database 
    const getCategory = await Category.findOne(queryFilter)
    //check is the category not found
    if(!getCategory){
        return next(new ErrorHandleClass("no category found", 404))
    }
    //send response
    res.status(200).json({message:"your category : " , getCategory})
}
/*=================================================================================================================================================*/ 
/**
 * @api {PUT} /categories/updateCategory/:_id  update categories
 */
export const updateCategory =async (req,res,next)=>{
    //request the data
    const {_id} = req.params
    const {name } = req.body
    //find the category 
    const category = await Category.findById(_id)
    if(!category){
        return next(new ErrorHandleClass("category should update not found", 400))
    }
    //create slug to the name if the name exist
    if(name){
    const slug = slugify(name , {
        replacement : '_',
        lower: true,
    })
    //update  name , slug 
    category.name=name
    category.slug = slug
}
    //update image 
    if(req.file){
        const splitPublicId = category.Images.public_id.split(
            `${category.customId}/`
        )[1];
        const {secure_url} = await cloudinaryConfig().uploader.upload(req.file.path,{
            folder: `${process.env.UPLOADS_FOLDER}/categories/${category.customId}`,
            public_id:splitPublicId,
        })
        category.Images.secure_url = secure_url
    }
    //save the update
    await category.save();

    //send response
    res.status(200).json({message:"category is updated" , category})


}
/*=================================================================================================================================================*/ 
/**
 * @api {DELETE} /categories/deleteCategory/:_id  delete categories
 */
export const deleteCategory = async(req,res,next)=>{
    //request the data
    const {_id} = req.params
    //find and delete the data by id
    const category = await Category.findByIdAndDelete(_id)
    if(!category){
        return next(new ErrorHandleClass("category not found to delete", 400))
    }
    //get path this category’s image
    const categoryPath = `${process.env.UPLOADS_FOLDER}/categories/${category.customId}`
    //delete the image
    await cloudinaryConfig().api.delete_resources_by_prefix(categoryPath)
    //delete the folder
    await cloudinaryConfig().api.delete_folder(categoryPath)

    // delete relevent sub-categories and brands from db
    const deleteSubCategorys = await SubCategory.deleteMany({categoryId:_id})
    if(deleteSubCategorys?.deletedCount){
        await Brands.deleteMany({categoryId:_id})
    }
    //TODO delete relevent products from db

    //send response
    res.status(200).json({message:"delete is done ",category})
}
