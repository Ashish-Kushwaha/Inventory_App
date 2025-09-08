import dotenv from "dotenv"
import connectDB from "./db/connection.js";
import { app } from "./app.js";
import {expiryCheckJob} from "./utils/expiryCheck.js"
dotenv.config()

connectDB()
.then(()=>{
    app.listen(process.env.PORT||8000,()=>{
        console.log("Server is running at port ", process.env.PORT);
    })
    expiryCheckJob()
})
.catch((err)=>{
   console.log("MongoDb connection failed",err)
})