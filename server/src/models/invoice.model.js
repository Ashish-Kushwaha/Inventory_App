import mongoose ,{Schema}from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const invoiceSchema = new mongoose.Schema(
  {
    invoiceID: {
      type: String,
      required: true,
      unique: true,
    },
    referenceNumber: {
      type: String,
      default: null,
      sparse: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: { 
      type: String,
      enum:["Paid","Unpaid"], 
      default:"Unpaid",
      required:true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    processed:{
    type:Number,
    default:0
  },
    userID:{
    type:Schema.Types.ObjectId,
    ref:"User", 
    required:true,
  },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref:"Product"
        },
        productName:String,
        quantity: Number,
        price: Number,
      },
    ],
  },
  { timestamps: true }
);
invoiceSchema.plugin(mongooseAggregatePaginate);
export const Invoice = mongoose.model("Invoice", invoiceSchema);
