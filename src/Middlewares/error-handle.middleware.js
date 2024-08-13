import { ErrorHandleClass } from "../utils/error-class.utils.js";


export const errorHandle = (API)=>{
    return (req,res,next)=>{
        API(req,res,next)?.catch((err)=>{
            console.log("error in error handle middleware",err);
            next(new ErrorHandleClass("internal server error", 500 , err.stack))
        })
    }
}


export const globalResponse = (err,req,res,next)=>{
    if(err){
        res.status(err.status || 500).json({
            message :"fail response",
            err_msg:err.message,
            stack:err.stack,
        })
    }
}