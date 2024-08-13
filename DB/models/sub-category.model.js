import mongoose from "mongoose";
const {model , Schema} = mongoose

const subCategorySchema = new Schema(
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
        Images:{
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
        
    },
    {timestamps:true}
    
);
export const SubCategory = mongoose.models.SubCategory || model("SubCategory",subCategorySchema)