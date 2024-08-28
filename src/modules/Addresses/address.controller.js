import { Addresses } from "../../../DB/models/index.js"



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