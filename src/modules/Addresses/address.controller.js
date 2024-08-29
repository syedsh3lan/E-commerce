import { Addresses } from "../../../DB/models/index.js"
import { ErrorHandleClass } from "../../utils/index.js"



/** 
*@api {post} /address/addAddress  add new address
*/
export const addAddress = async(req,res,next)=>{
    //get data
    const { country , city, postalCode , buildingNo , flootNo , addressLabel , SetAsDefualt} = req.body
    const userId = req.authUser._id

    //new object 
    const addressObject = new Addresses({
        userId ,
        country,
        city,
        postalCode,
        buildingNo,
        flootNo,
        addressLabel,
        isDefualt: [true , false].includes(SetAsDefualt) ? SetAsDefualt : false
    })

    //check if the new address is the defualt then we need to update the old defualt address to be not deafult
    if(addressObject.isDefualt){
        await Addresses.updateOne({userId, isDefualt:true},{isDefualt : false})
    }


    //save data 
    const savedAddress = await addressObject.save()
    if(!savedAddress){
        return next(new ErrorHandleClass("address not created",500))
    }
    //send response
  
    res.status(201).json({message : "address created successfully" , savedAddress})


}


/** 
*@api {put} /address/updateAddress  update address
*/
export const updateAddress = async(req,res,next)=>{
    //get data
    const {country , city, postalCode , buildingNo , flootNo , addressLabel , setAsDefualt}=req.body
    const userId = req.authUser._id
    const {addressId} = req.params

    //check if address exist
    const address = await Addresses.findOne({_id:addressId , userId , isMarkedAsDeleted : false})
    if(!address){
        return next(new ErrorHandleClass("this address is not exist",400))
    }

    //push data
    if(country) address.country = country
    if(city) address.city = city
    if(postalCode) address.postalCode = postalCode  
    if(buildingNo) address.buildingNo = buildingNo
    if(flootNo) address.flootNo = flootNo
    if(addressLabel) address.addressLabel = addressLabel
    if(setAsDefualt === true){
        address.isDefualt = true
        await Addresses.updateOne({userId , isDefualt : true , _id:{ $ne :address._id} },{isDefualt : false})
    }else if(setAsDefualt === false){
        address.isDefualt = false
    }

    //save data
    const updatedAddress = await address.save()
    if(!updatedAddress){
        return next(new ErrorHandleClass("address not updated",500))
    }
    //send response
    res.status(200).json({message : "address updated successfully" , updatedAddress})
}

/** 
*@api {put} /address/deleteAddress  delete address
*/

export const softDeleteAddress = async(req,res,next)=>{
    //get data
    const {addressId} = req.params
    const userId = req.authUser._id

    //find el address and delete
    const address = await Addresses.findOneAndUpdate(
        {userId , _id:addressId , isMarkedAsDeleted:false},
        {isMarkedAsDeleted:true , isDefualt : false},
        {new:true}
    )
    
    //check if address not found
    if(!address){
        return next(new ErrorHandleClass("this address is not exist",400))
    }
    //send response
    res.status(200).json({message : "address deleted successfully" , address})
}

/** 
*@api {get} /address/getAllAddress  get all address
*/

export const getAllAddresses = async(req,res,next)=>{
    //get data
    const userId = req.authUser._id

    //get all address
    const ALLAddresses = await Addresses.find({userId , isMarkedAsDeleted : false})
    if(!ALLAddresses){
        return next(new ErrorHandleClass("this Addresses is not exist",400))
    }
    //send response
    res.status(200).json({message : "address fetched successfully" , ALLAddresses})
}