import { Coupon, User } from "../../../DB/models/index.js"
import { errorHandle } from "../../Middlewares/index.js"
import { ErrorHandleClass } from "../../utils/index.js"





/**
 * @api {post} /coupons/createCoupon     create coupon
 */


export const createCoupon = async(req, res, next) => {
    //get data
    const {couponCode , couponAmount , couponType , from , till , Users} = req.body
    //check if coupon already exist
    const isCouponExist = await Coupon.findOne({couponCode}) 
    if(isCouponExist){
        return next(new ErrorHandleClass("this coupon is already exist" , 400))
    }

    //check if users not exist 
    const userIds = Users.map(u => u.userId)
    const users = await User.find({_id : {$in : userIds}})
    if(users.length !== userIds.length){
        return next(new ErrorHandleClass("users not found" , 404))
    }
    //create object
    const newCoupon = new Coupon({
        couponCode,
        couponAmount,
        couponType,
        from,
        till,
        Users,
        createdBy : req.authUser._id
    })
    //save coupon
    await newCoupon.save()
    //send response
    res.status(201).json({ message: "coupon created successfully"  ,newCoupon}) 


}