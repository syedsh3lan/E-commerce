import mongoose from "mongoose";
const {model , Schema} = mongoose


const addreesesSchema = new Schema({

    userId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required :true,
    },
    country:{
        type : String,
        required :true,
    },
    city:{
        type : String,
        required :true,
    },
    postalCode:{
        type: Number,
        required :true,
    },
    buildingNo:{
        type:Number,
        required :true,
    },
    flootNo:{
        type:Number,
        required :true,
    },
    addressLabel :{
        type:String,
    },
    isDefualt:{
        type : Boolean,
        default :false
    },
    isMarkedAsDeleted:{
        type:Boolean,
        default:false
    },
},{timestamps:true})

export const Addresses = mongoose.models.Addresses || model("Addresses",addreesesSchema) 