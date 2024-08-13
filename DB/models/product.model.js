import slugify from "slugify";
import mongoose from "mongoose";

const { model, Schema } = mongoose;

const productSchema = new Schema({
    title:{
        type : String,
        required : true,
        trim:true,
    },
    slug:{
        type:String,
        required:true,
        default:function(){
            return slugify(this.title , {replacement:"_" , lower:true})
        }
    },
    overview:{
        type:String
    },
    specs:{
        type:Object,//map of string
    },
    badges:{
        type:String,
        enum:["New", "Sale","Best Seller"],
    },
    price:{
        type:Number,
        required:true,
        min:20
    },
    appliedDiscount:{
        amount:{
            type:Number,
            min:0,
            default:0
        },
        type:{
            type:String,
            enum:["Fixed","Percentage"],
            default:"Fixed"
        },
    },
    appliedPrice:{
        type:Number,
        required:true,
        default:function(){
            if(this.appliedDiscount.type === "Percentage"){
                return this.price - (this.price * this.appliedDiscount.amount)/100
            }else if(this.appliedDiscount.type === "Fixed"){
                return this.price - this.appliedDiscount.amount
            }else {
                return this.price
            }
        }
    },
    stock:{
        type:Number,
        required:true,
        min:10
    },
    rating:{
        type:Number,
        min:0,
        max:5,
        default:0
    },
    Images:{
        URLs:[
            {
            secure_url:{
                type:String,
                required:true
            },
            public_id:{
                type:String,
                required:true,
                unique:true
            },   
        }
    ],
        customId:{
            type:String,
            required:true,
            unique:true
        },
    },
    categoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref : "Category",
        required :true,
    },
    subCategoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref : "SubCategory",
        required :true,
    },
    brandId:{
        type:mongoose.Schema.Types.ObjectId,
        ref : "Brands",
        required :true,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref : "User",
        required:false, //TODO :change to true after adding authentication 
    },

},{timestamps:true});


export const Product = mongoose.models.Product|| model("product",productSchema)