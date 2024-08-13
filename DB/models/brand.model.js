import mongoose from "mongoose";
const {model , Schema} = mongoose

const brandSchema = new Schema(
    {
        name:{
            type : String,
            required : true,
            unique :true,
            trim:true,
        },
        slug:{
            type : String,
            required : true,
            unique: true,
        },
        createdBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref : "User",
            required:false, //TODO :change to true after adding authentication 
        },
        logo:{
                secure_url:{
                    type :String,
                    required:true,
                },
                public_id:{
                    type:String,
                    required:true,
                    unique:true,
                },
            },
        customId:{
            type :String,
            required:true,
            unique:true,
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
        }      
    },
    {timestamps:true}
    
);
export const Brands = mongoose.models.Brands || model("Brands",brandSchema)