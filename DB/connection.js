import mongoose, { Mongoose } from "mongoose";

 const connection_db = async ()=>{
    try {
        await mongoose.connect(process.env.CONNECTION_DB_URI)
        console.log("connected to the database");
    } catch (error) {
        console.log("error connection to the database" , error.message);
    }
}

export default connection_db