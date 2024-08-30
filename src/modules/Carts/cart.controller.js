
import { Product,Cart } from "../../../DB/models/index.js"
import { ErrorHandleClass } from "../../utils/index.js"


/**
 * @api {post} /carts/addToCart     add to cart
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

/**
 * @api {put} /carts/removeFromCart     remove from cart
 */
export const removeFromCart = async(req,res,next)=>{
    //get data
    const userId = req.authUser._id
    const {productId} = req.params

    //check if cart and product exist
    const cart = await Cart.findOne({userId , 'products.productId':productId})
    if(!cart){
        return next(new ErrorHandleClass("this cart is not exist",400))
    }

    //remove product from cart
    cart.products = cart.products.filter(p=>p.productId != productId)
    //check if cart is empty
    if(cart.products.length === 0){
        await Cart.deleteOne({userId})
        return res.status(200).json({message : "product remove from cart and cart is empty"})
    }
    //handle the new total price
    cart.totalPrice =0
    cart.products.forEach(p=>{
        cart.totalPrice += p.price * p.quantity
    })
    //save data
    await cart.save()
    //send response
    res.status(200).json({message : "product remove from cart successfully" , cart})
}

/**
 * @api {post} /carts/updateCart    update cart
 */
export const updateCart = async(req,res,next)=>{
    //get data
    const userId = req.authUser._id
    const {productId}= req.params
    const {quantity} = req.body

    const cart = await Cart.findOne({userId , 'products.productId':productId})
    if(!cart){
        return next(new ErrorHandleClass("this cart or product is not exist",400))
    }
    //check if quantity is valid
    const product = await Product.findOne({_id :productId , stock :{$gte : quantity} })
    if(!product){
        return next(new ErrorHandleClass("stock for this product is less than your quantity you need ",400))
    }

    //update cart
    const productsIndex = cart.products.findIndex(p => p.productId.toString() == product._id.toString())
    cart.products[productsIndex].quantity = quantity

    cart.totalPrice = 0
    cart.products.forEach(p=>{
        cart.totalPrice += p.price * p.quantity
    })

    //save data
    await cart.save()
    //send response
    res.status(200).json({message : "cart updated successfully" , cart})
}

/**
 * @api {get} /carts/getCart     get cart
 */
export const getCart  = async(req,res,next)=>{
    //get data
    const userId = req.authUser._id
    const cart = await Cart.findOne({userId})
    if(!cart){
        return next(new ErrorHandleClass("this cart is not exist",400))
    }
    //send response
    res.status(200).json({message : "cart fetched successfully" , cart})
}

