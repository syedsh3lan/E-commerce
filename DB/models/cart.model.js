import mongoose from "mongoose";

const {model , Schema}= mongoose
const cartSchema = new Schema({

    userId:{ 
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required :true, 
    },

    products:[{
        productId:{
            type : mongoose.Schema.Types.ObjectId,
            ref : "Product",
            required :true,
        },
        quantity:{
            type:Number,
            required :true,
            min:1,
            default:1
        },
        price:{
            type:Number,
            required :true,
        },
    }],

    totalPrice:{
        type:Number,
    },
},{timestamps:true})

export const Cart = mongoose.models.Cart || model("Cart" , cartSchema)