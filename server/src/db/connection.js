
import mongoose from "mongoose";
// import { DB_NAME } from "../constants.js"; 
// console.log(`${process.env.MONGODB_URI}/${DB_NAME}`)
     
const connectDB=async()=>{ 
    try{
        const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URI}`,{
        family: 4
      })
        console.log("MongoDB Connection established !! ",connectionInstance.connection.host)
    }catch(err){
        console.log("MONGOdB connaction failed ", err)
        process.exit(1);
    }
}

export default connectDB;
