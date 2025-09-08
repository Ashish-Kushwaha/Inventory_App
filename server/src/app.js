import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors'

const app =express();
app.use(cors({
    origin:process.env.CORS_ORIGIN, 
    credentials:true
})) 
 
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./routes/user.routes.js"

app.use("/api/v1/users",userRouter)

import productRouter from "./routes/product.routes.js"

app.use("/api/v1/products",productRouter); 

import invoiceRouter from "./routes/invoice.routes.js"

app.use("/api/v1/invoices",invoiceRouter);

import homeRouter from "./routes/home.routes.js"

app.use("/api/v1/home",homeRouter)

import statisticsRouter from "./routes/statistics.routes.js"
app.use("/api/v1/statistics",statisticsRouter)
export {app}