import { comparePassword, hashpassword } from "../../utils/index.js"
import { ErrorHandleClass } from "../../utils/index.js"
import { Addresses, User } from "../../../DB/models/index.js"
import { generateToken , verifyToken } from "../../utils/index.js"
import { sendEmail } from "../../services/send-email.service.js"


/** 
*@api {signUP} /user/signUp  signUp
*/
export const signUP = async(req,res,next)=>{
    const{username, email, password  ,age, gender ,phone , country , city, postalCode , buildingNo , flootNo , addressLabel} = req.body
    //check if email exist
    const isEmailExist = await User.findOne({email})
    if(isEmailExist){
        return next(new ErrorHandleClass("this email is already exist",400))
    }

    //hash password
   const Pass = hashpassword({password}) 
    //prepare data
    const user = new User({
        username,
        email,
        password : Pass,
        age,
        gender,
        phone 
    })
    
    const adderssObject = new Addresses({
        userId : user._id,
        country,
        city,
        postalCode,
        buildingNo,
        flootNo,
        addressLabel,
        isDefualt: true
    })
    //save data
    const newUser = await user.save()
    const savedAddress = await adderssObject.save() 
    if(!newUser){
        return next(new ErrorHandleClass("user not created",500))
    }
    if(!savedAddress){
        return next(new ErrorHandleClass("user adress has problem",500))
    }
    

    //generate token 
    const token = generateToken({payload:{_id : newUser._id}} )
    //send email to verify

    await sendEmail({to : email , subject : "verify your email" , html : `<p>please verify your email by click on the link below <a href='${req.protocol}://${req.headers.host}/user/verify-account?token=${token}'>Link</a></p>`})

    //send response
     res.status(201).json({message : "user created successfully" , newUser , savedAddress})
    
}  


//verify Email api
// export const confirmEmail = async(req,res,next)=>{
//     //destruct token 
//     const {token} = req.params;
//     //verify el token
//     const { _id}=verifyToken({token});
//     //find user and update el confirm 
//     const user = await User.findOneAndUpdate(
//         {_id,isEmailverified:false},
//         {isEmailverified:true},
//         {new:true}
//     )
//     //check if user not found
//     if(!user){
//         return res.status(400).json({message: "user not found"}) 
//        }
//        //return el response
//        res.status(200).json({message:"email confirmed"})
// }

/*=================================================================================================================================================*/ 

/** 
*@api {login} /user/login  login
*/

export const login = async(req,res,next)=>{
    const {email , password} = req.body
    //check if email exist 
    const user = await User.findOne({email})
    if(!user){
        return next(new ErrorHandleClass("this email is not exist",400))
    }

    //check password
    const isMatch = comparePassword({password,hashPassword : user.password})
    if(!isMatch){
        return next(new ErrorHandleClass("password is not correct",400))
    } 

    //generate token
    const accessToken = generateToken({payload:{_id : user._id}})
    //send response
    res.status(200).json({message : "login successfully" , accessToken})
}



