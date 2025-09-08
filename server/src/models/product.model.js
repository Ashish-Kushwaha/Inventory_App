import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { type } from "os";
const productSchema=new Schema({
  productName:{
    type:String,
    required:true,
    trim:true,
    // index:true
  },
  productImage:{
   type:String,
   default:"",
  },
  userID:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  productID:{
    type:String,
    required:true, 
    unique:true,
    lowercase:true,
    trim:true,
    // index:true
  },
  category:{
    type:String,
    required:[true,"Password is required"]
  },
  price:{
   type:Number,
   required:true, 
  },
  quantity:{
   type:Number,
   required:true, 
  },
  unit:{
   type:String,
   required:true, 
  },
  expiryDate:{
    type:Date,
    required:true,
  },
  thresholdValue:{
    type:Number,
    required:true,
  },
  availability:{
    type:String,
    required:true,
    enum:["In-stock","out-of-stock","low-stock","expired"],
    default:"in-stock"
  }
},{timestamps:true});
// productSchema.plugin(mongooseAggregatePaginate);
export const Product = mongoose.model("Product",productSchema);