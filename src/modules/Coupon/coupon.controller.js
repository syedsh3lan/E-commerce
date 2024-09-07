import { Coupon, CouponChangeLog, User } from "../../../DB/models/index.js"
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

/**
 * @api {put} /coupons/updateCoupon/:couponId     update coupon
 */

export const updateCoupon = async(req , res , next)=>{
    //get data
    const {couponId}= req.params
    const userId = req.authUser._id
    const {couponCode , couponAmount , couponType , from , till , Users} = req.body

    //check if coupon is exist 
    const coupon = await Coupon.findById(couponId)
    if(!coupon){
        return next(new ErrorHandleClass("coupon not found" , 404))
    }
    //prepare log update object
    const logUpdatedObject = {couponId , updatedBy :userId , changes:{}}
    //update coupon
    if(couponCode){
        const isCouponCodeExist = await Coupon.findOne({couponCode})
        if(isCouponCodeExist){
            return next(new ErrorHandleClass("this coupon code is already exist" , 400))
        } 
        coupon.couponCode = couponCode
        logUpdatedObject.changes.couponCode = couponCode
        
    }
    if(couponAmount){
        coupon.couponAmont = couponAmount
        logUpdatedObject.changes.couponAmount = couponAmount
    }
    if(couponType){
        coupon.couponType = couponType
        logUpdatedObject.changes.couponType = couponType
    }
    if(from){
        coupon.from = from
        logUpdatedObject.changes.from = from
    }
    if(till){   
        coupon.till = till
        logUpdatedObject.changes.till = till
    }
    if(Users){
        const userIds = Users.map(u => u.userId)
        const users = await User.find({_id : {$in : userIds}})
        if(users.length !== userIds.length){
        return next(new ErrorHandleClass("users not found" , 404))
    }
    coupon.Users = Users
    logUpdatedObject.changes.Users =Users
    }
    //save coupon object
    await coupon.save()
    //save log object
    const log =await new CouponChangeLog(logUpdatedObject).save()
    //send response
    res.status(200).json({message : "coupon updated successfully" , coupon ,log})
}