import mongoose from "mongoose";
import { userType } from "../../src/utils/constant/enums.js";

const { model, Schema } = mongoose;
const userSchema = new Schema({
    username:{
        type : String,
        required : true,
        trim:true,
    },
    email:{
        type : String,
        required : true,
        unique :true,
        trim:true,
        lowercase:true
    },
    password:{
        type : String,
        required : true,
        trim:true,
    },
    userType:{
        type : String,
        required : false,
        enum:["Buyer","Admin"],
        default:"Buyer"
    },
    age:{
        type : Number,
        required : true,
    },
    gender:{
        type : String,
        required : true,
        enum:["Male","Female"]
    },
    phone:{
        type : String,
        required : true,
    },
    isEmailverified:{
        type : Boolean,
        default :true
    },
    isMarkedAsDeleted:{
        type : Boolean,
        default :false
    },
},{timestamps:true}
);
export const User = mongoose.models.User || model("User",userSchema)