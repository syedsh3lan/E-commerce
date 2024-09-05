import { Coupon, User } from "../../../DB/models/index.js"
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

/**
 * @api {get} /coupons/getCoupons     get coupons
 */
export const getCoupons = async(req, res, next) => {
    //get data
    const {isEnable} = req.query
    //find coupons
    const filters = {}
    if(isEnable){
        filters.isEnable = isEnable === "true" ? true : false
    }
    const coupons = await Coupon.find(filters)

    //send response
    res.status(200).json({message : "coupons fetched successfully" , coupons})
}

/**
 * @api {get} /coupons/getCouponById/:couponId     get coupon by id
 */
export const getCouponById = async(req , res , next)=>{
    //get data
    const {couponId} = req.params
    //find coupon
    const coupon  = await Coupon.findById({_id : couponId})
    if(!coupon){
        return next(new ErrorHandleClass("coupon not found" , 404))
    }
    //send response
    res.status(200).json({message : "coupon fetched successfully" , coupon})


}