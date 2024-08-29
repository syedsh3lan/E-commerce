
import { Product,Cart } from "../../../DB/models/index.js"
import { ErrorHandleClass } from "../../utils/index.js"


/**
 * @api {post} /carts/addToCart     add cart
 */


export const addToCart = async (req, res, next) => {
    //get data
    const userId = req.authUser._id
    const {productId}= req.params
    const {quantity} = req.body

    //check if product exist 
    const product = await Product.findOne({_id:productId , stock :{ $gte: quantity}})
    if(!product){
        return next(new ErrorHandleClass("this product is not exist",400))
    }
    //check if cart exist and if not create new cart
    const cart  = await Cart.findOne({userId})
    if(!cart){
        const totalPrice = product.appliedPrice * quantity
        const newCart = new Cart({
            userId,
            products:[{
                productId : product._id,
                quantity,
                price : product.appliedPrice
            }],
            totalPrice
        })

        //save data
        await newCart.save()
        //send response
        return res.status(201).json({message : "cart created successfully" , newCart})   
    }

    //cart already ,check if product exist in cart
    const isProductExist = await cart.products.find(product=>product.productId == productId)
    if(isProductExist){
        return next(new ErrorHandleClass("this product is already exist in cart",400))
    }

    //push product in cart 
    cart.products.push({productId:product._id , quantity , price:product.appliedPrice})
    cart.totalPrice +=product.appliedPrice * quantity

    //save data
    await cart.save()
    //send response
    res.status(201).json({message : "product added successfully" , cart})
} 