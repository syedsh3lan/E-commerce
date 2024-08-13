import {ErrorHandleClass , cloudinaryConfig} from "../../utils/index.js"
import {Product} from "../../../DB/models/index.js"
import { nanoid } from "nanoid"
import slugify from "slugify"



/**
 * @api {POST} /products/create  create Product
*/
export const createProduct = async(req,res,next)=>{
    //request the data
    const{title,overview,specs,price,discountAmount,discountType,stock}= req.body
    

    //req files
    if(!req.files.length){
        return next(new ErrorHandleClass("plz upload your image", 400))
    }
    //ids check
    const brandCheck = req.document    
     //upload image 
    const customId = nanoid(4);
    const brandCustomId = brandCheck.customId;
    const categoryCustomId = brandCheck.categoryId.customId;
    const subCategoryCustomId = brandCheck.subCategoryId.customId;
    const folder = `${process.env.UPLOADS_FOLDER}/categories/${categoryCustomId}/sub-categories/${subCategoryCustomId}/brands/${brandCustomId}/products/${customId}`
    

    const URLs=[];
    for (const file of req.files) {
        const{secure_url , public_id}= await cloudinaryConfig().uploader.upload(file.path, {
            folder,
        })
        URLs.push({secure_url,public_id})
    }

    //prepare product object 
    const product = {
        title,
        overview,
        specs:JSON.parse(specs),
        price,
        appliedDiscount:{
            amount:discountAmount,
            type:discountType,
        },
        stock,
        brandId:brandCheck._id,
        categoryId:brandCheck.categoryId._id,
        subCategoryId:brandCheck.subCategoryId._id,
        Images:{
            URLs,
            customId
        },
    };

    //create product in database
    const newProduct = await Product.create(product)
    //send response
    res.status(201).json({message:"product created successfully" , newProduct})


}
/*================================================================================================================================================= */ 
/**
 * @api {PUT} /products/updateProduct  update Product 
*/
export const updateProduct = async(req,res,next)=>{
    //request the data
    const {_id} = req.params
    const {title,overview,specs,badges,price,discountAmount,discountType,stock}= req.body
    //check if the product exist tto update
    const product = await Product.findById(_id).populate("brandId").populate("categoryId").populate("subCategoryId")
    
    if(!product){
        return next(new ErrorHandleClass("product is not found", 404))
    }
    //update product title and slug
    if(title){
        product.title = title
        product.slug = slugify(title , {
            replacement:"_" ,
            lower:true
        })
    }
    //update product overview , badegs,stock
    if(overview)product.overview = overview
    if(badges)product.badges = badges
    if(stock)product.stock = stock
    
    //update product price
    if(price || discountAmount || discountType){
        const newPrice = price || product.price
        const discount = {}
        discount.amount = discountAmount || product.appliedDiscount.amount
        discount.type = discountType || product.appliedDiscount.type

        if(discount.type === "Percentage"){
            product.appliedPrice = newPrice - (newPrice * discount.amount)/100
        }else if (discount.type === "Fixed"){
            product.appliedPrice = newPrice - discount.amount
        }else{
            product.appliedPrice = newPrice
        }
        product.price = newPrice
        product.appliedDiscount = discount

    }

    //update product images
  /*  if(req.files.length){
        const URLs = []
        
        for(let i = 0; i < req.files.length; i++){
            let file = req.files[i]
            let splitPublicId = product.Images.URLs[i].public_id.split(
                `${product.Images.URLs[i].customId}/`
            )[1]
            
            
            let folder = `${process.env.UPLOADS_FOLDER}/categories/${product.categoryId.customId}/sub-categories/${product.subCategoryId.customId}/brands/${product.brandId.customId}/products/${product.Images.customId}`
            
                       
            let {secure_url} = await cloudinaryConfig().uploader.upload(file.path, {
            folder,
            public_id:splitPublicId
    })
    URLs.push({secure_url,public_id})  
    }

    product.Images.URLs = URLs
   }*/

   //update specs
    if(specs){product.specs = JSON.parse(specs)}
    //update product
    const updatedProduct = await product.save()
    //send response
    res.status(200).json({message:"product updated successfully" , updatedProduct})
    


}
/*================================================================================================================================================= */ 
/**
 * @api {GET} /products/getProduct  get Product 
*/
export const getProduct = async (req, res, next) => {
    //request the data
    const {id, title, slug } = req.query
    const queryFilter = {}
    //check the data and put it in object to use it
    if(id)queryFilter._id = id
    if(title)queryFilter.title = title
    if(slug)queryFilter.slug = slug

    //find product in database
    const product = await Product.findOne(queryFilter)
    //check is the product not found
    if (!product) {
        return next(new ErrorHandleClass("product is not found", 404))
    }
    //send response
    res.status(200).json({ message: "product fetched successfully", product })
}

/*================================================================================================================================================= */ 
/**
 * @api {DELETE} /products/deleteProduct  delete Product 
*/
export const deleteProduct = async (req, res, next) => {
    //request the data
    const {_id} = req.params
    //find product in database
    const product = await Product.findByIdAndDelete(_id).populate("brandId").populate("categoryId").populate("subCategoryId")
    //check is the product not found
    if (!product) {
        return next(new ErrorHandleClass("product is not found", 404))
    }
    //get path this product’s image
    const productPath = `${process.env.UPLOADS_FOLDER}/categories/${product.categoryId.customId}/sub-categories/${product.subCategoryId.customId}/brands/${product.brandId.customId}/products/${product.Images.customId}`
    //delete image from cloudinary
    await cloudinaryConfig().api.delete_resources_by_prefix(productPath)
    await cloudinaryConfig().api.delete_folder(productPath)

    //send response
    res.status(200).json({ message: "product deleted successfully" })
}