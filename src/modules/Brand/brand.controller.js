import slugify from "slugify";
import { nanoid } from "nanoid";
import {  SubCategory, Brands } from "../../../DB/models/index.js"
import { ErrorHandleClass ,cloudinaryConfig  } from "../../utils/index.js"
/**
 @api {POST} /brands/create  create Brand
 */
export const createBrand = async (req, res, next) => {
     //check subCategory and category is exist 
    const { idForCategory, idForSubCategory} = req.query
        const subCategory = await SubCategory.findById({
            _id:idForSubCategory,
            categoryId:idForCategory,
        }).populate("categoryId")
        if(!subCategory){
            return next(new ErrorHandleClass("subCategory is not found", 404))
        }
        //request the data
        const {name} = req.body
        //generate slug()
        const slug = slugify(name, {
            replacement: "_", 
            lower: true
        })
        //get the image
        if(!req.file){
            return next(new ErrorHandleClass("plz upload your image", 400))
        }
        //upload el image on cloudinary
        const customId = nanoid(4)
        const {secure_url, public_id} = await cloudinaryConfig().uploader.upload(req.file.path, {
            folder: `${process.env.UPLOADS_FOLDER}/categories/${subCategory.categoryId.customId}/sub-categories/${subCategory.customId}/brands/${customId}`
        })
        //prepare brand object
        const brand = {
            name,
            slug,
            logo: {
                secure_url,
                public_id
            },
            customId,
            categoryId: subCategory.categoryId._id,
            subCategoryId: subCategory._id,
        }
        //create brand in database
        const newBrand = await Brands.create(brand)
        //send response
        res.status(201).json({ message: "brand created successfully", newBrand })

}
/*=================================================================================================================================================*/ 
/**
 @api {GET} /brands/getBrand  get Brand
 */
export const getBrand = async (req, res, next) => {
    //request the data
    const {id, name, slug } = req.query
    const queryFilter = {}
    //check the data and put it in object to use it
    if(id)queryFilter._id = id
    if(name)queryFilter.name = name
    if(slug)queryFilter.slug = slug

    //find brand in database
    const brand = await Brands.findOne(queryFilter)
    //check is the brand not found
    if (!brand) {
        return next(new ErrorHandleClass("brand is not found", 404))
    }
    //send response
    res.status(200).json({ message: "brand fetched successfully", brand })
}
/*=================================================================================================================================================*/ 
/**
 * @api {PUT} /brands/updateBrand  update Brand
 */
export const updateBrand = async (req, res, next) => {
    //check if brand is exist
    const {_id} = req.params
    const brand = await Brands.findById(_id).populate("categoryId").populate("subCategoryId")
    if(!brand){
        return next(new ErrorHandleClass("brand is not found", 404))
    }

    //request the data
    const {name} = req.body
    //generate slug()
    if(name){
        const slug = slugify(name, {
            replacement: "_", 
            lower: true
        })
        brand.name = name
        brand.slug = slug  
    }

    //update the brand image
    if(req.file){
        const splitPublicId = brand.logo.public_id.split(
            `${brand.customId}/`
        )[1];
        const {secure_url} = await cloudinaryConfig().uploader.upload(req.file.path, {
            folder: `${process.env.UPLOADS_FOLDER}/categories/${brand.categoryId.customId}/sub-categories/${brand.subCategoryId.customId}/brands/${brand.customId}`,
            public_id: splitPublicId
        })
        brand.logo.secure_url = secure_url
    }
    
    //save brand in database
    const updateBrand = await brand.save()
    //send response
    res.status(200).json({ message: "brand updated successfully", updateBrand })

    
}
/*=================================================================================================================================================*/ 
/**
 * @api {DELETE} /brands/deleteBrand  delete Brand
 */
export const deleteBrand = async (req, res, next) => {
   //request the data
    const {_id} = req.params
    //find brand in database and delete it
    const brand = await Brands.findByIdAndDelete(_id).populate("categoryId").populate("subCategoryId")
    if(!brand){
        return next(new ErrorHandleClass("brand is not found", 404))
    }
    //get path this brand’s image
    const brandPath = `${process.env.UPLOADS_FOLDER}/categories/${brand.categoryId.customId}/sub-categories/${brand.subCategoryId.customId}/brands/${brand.customId}`
    //delete image from cloudinary
    await cloudinaryConfig().api.delete_resources_by_prefix(brandPath)
    //delete the folder
    await cloudinaryConfig().api.delete_folder(brandPath) 
    //TODO delete relevent product from db   
    //send response
    res.status(200).json({ message: "brand deleted successfully", brand })
}