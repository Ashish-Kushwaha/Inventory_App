import mongoose, {Schema} from "mongoose";

const otpSchema=new Schema({
  email:{
    type:String,
    required:true,
  },
  otp:{
    type:Number,
    required:true
  }
},{timestamps:true});

export const Otp=mongoose.model("Otp",otpSchema);
