import mongoose from "mongoose";

const {model, Schema} = mongoose
const couponSchema = new Schema({
    couponCode :{
        type : String,
        required :true,
        unique :true,
    },
    couponAmount:{
        type:String,
        required:true

    },
    couponType:{
        type:String,
        required:true,
        enum:["Fixed","Percentage"],

    },
    from :{
        type:Date,
        required:true
    },
    till:{
        type : Date,
        required:true
    },
    Users:[{
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        maxCount:{
            type : Number,
            required:true,
            min:1
        },
        usageCount:{
            type:Number,
            default:0
        },

    }],
    isEnable :{
        type:Boolean,
        default:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
    

    
},{timestamps:true})

export const Coupon = mongoose.models.Coupon || model("Coupon",couponSchema)
