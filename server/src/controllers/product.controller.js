import fs from "fs";
import csvParser from "csv-parser"; // install with npm i csv-parser
import { v4 as uuidv4 } from "uuid";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Product } from "../models/product.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js"

import { Invoice } from "../models/invoice.model.js";

const generateInvoiceID = async () => {
  const randomPart=Math.floor(1000 + Math.random() * 9000);
  const exist = await Invoice.findOne({ invoiceID: `INV-${randomPart}` });
  if (exist) return generateInvoiceID(); // try again if exists
  
  return `INV-${randomPart}`;
};




export const uploadCSVProducts = asyncHandler(async (req, res) => {
  if (!req.file) {
    
    throw new ApiError(400,"No CSV file uploaded" )
  }

  const userID = req.user._id; // Replace with req.user._id if using auth
  const results = [];

  const filePath = req.file.path;

  try {
    // Wrap CSV parsing in a promise for async/await
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on("data", (data) => {
          // Validate required fields
          if (!data.productName || !data.price || !data.quantity) {
            console.warn("Skipping invalid row:", data);
          } else {
            results.push(data);
          }
        })
        .on("error", (err) => reject(err))
        .on("end", () => resolve());
    });

    if (results.length === 0) {
      throw new ApiError(400,"No valid CSV rows found")
    }

    // 1️⃣ Insert products into DB
    const productsWithUser = results.map((product) => ({
      ...product,
      productID:uuidv4(),
      userID,
    }));

    const insertedProducts = await Product.insertMany(productsWithUser);

    // 2️⃣ Generate invoice
    const invoiceID = await generateInvoiceID();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 10); // 10 days after invoice

    let totalAmount = 0;
    const invoiceProducts = insertedProducts.map((product) => {
      const productName=product.productName
      const quantity = Number(product.quantity) || 1;
      const price = Number(product.price) || 0;
      totalAmount += quantity * price;

      return {
        product: product._id,
        productName,
        quantity,
        price,
      };
    });

    const invoice = await Invoice.create({
      invoiceID,
      amount: totalAmount,
      status: "Unpaid",
      processed:0,
      dueDate,
      userID,
      products: invoiceProducts,
    });
    
    res.status(200).json(new ApiResponse(200,{productsAdded: insertedProducts.length,
      invoice,},"CSV uploaded, products added, and invoice generated"));
  } catch (error) {
    console.error("CSV processing error:", error);
    res.status(500).json({ message: "Error processing CSV", error: error.message });
  } finally {
    // Delete uploaded CSV
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting CSV:", err);
    });
  }
});


export const addProduct = async (req, res) => {
  try {
    const {
      productName,
      productID,
      category,
      price,
      quantity,
      unit,
      expiryDate,
      thresholdValue,
    } = req.body;

    // Check required fields
    if (
      !productName ||
      !productID ||
      !category ||
      !price ||
      !quantity ||
      !unit ||
      !expiryDate ||
      !thresholdValue
    ) {
      throw new ApiError(400, "All fields are required");
    }

    // Validate expiry date
    const expiry = new Date(expiryDate);
    if (isNaN(expiry)) {
      throw new ApiError(400, "Invalid expiry date");
    }
    const now = new Date();
    if (expiry <= now) {
      throw new ApiError(400, "Product expiry date must be in the future");
    }

    // Check if productID is unique
    const existingProduct = await Product.findOne({ productID });
    if (existingProduct) {
      throw new ApiError(400, "Product ID already exists");
    }

  
    const userID = req.user._id;

    // Check file
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const productImageLocalPath = req.file.path;
    const productImage = await uploadOnCloudinary(productImageLocalPath);
    // console.log("Uploaded to Cloudinary:", productImage);
    if (!productImage) {
      throw new ApiError(400, "Product image is required");
    }

    // Create Product
    const product = await Product.create({
      productName,
      productImage: productImage.url,
      userID,
      productID:uuidv4(),
      category,
      price: Number(price),
      quantity: Number(quantity),
      unit,
      expiryDate: expiry,
      thresholdValue: Number(thresholdValue),
      availability: Number(quantity) < Number(thresholdValue) ? "low-stock" : "In-stock",
    });
      fs.unlinkSync(productImageLocalPath);
    // Generate invoice
    const invoiceID = await generateInvoiceID();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 10);

    await Invoice.create({
      invoiceID,
      amount: Number(price) * Number(quantity),
      status: "Unpaid",
      dueDate,
      processed:0,
      userID,
      products: [
        {
          product: product._id,
          productName,
          quantity: Number(quantity),
          price: Number(price),
        },
      ],
    });

    return res
      .status(200)
      .json(new ApiResponse(200, product, "Product Added Successfully and Invoice Generated"));
  } catch (error) {
    console.error("❌ Error in addProduct:", error);
    res
      .status(500)
      .json({ message: "Error uploading product", error: error.message });
  }
};


export const getProductPageInfo = asyncHandler(async (req, res) => {
  const userId = req.user._id; // logged-in user
  
  // const userId = req.user._id; // logged-in user
  const page  = Math.max(1, Number(req.query.page) || 1);
  const limit = 9; 
  const skip = (page - 1) * limit;

  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);

  // Run independent queries in parallel
  const [
    categories,
    totalProducts,
    revenueAgg,
    topSelling,
    lowStock,
    outOfStock,
    paginatedProducts,
  ] = await Promise.all([
    // distinct categories for this user
    Product.distinct("category", { userID: userId }),

    // total count for this user
    Product.countDocuments({ userID: userId }),

    // revenue for this user
    Product.aggregate([
      { $match: { userID: userId } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $multiply: ["$price", "$quantity"] } },
        },
      },
    ]),

    // top products (last 7 days, highest quantity)
    Product.find({ userID: userId,availability:"out-of-stock", createdAt: { $gte: last7Days } })
      .sort({ quantity: -1 })
      .limit(5)
      .select("productName price quantity"),

    // low stock (≤ threshold, but still available)
    Product.find({
      userID: userId,
      $expr: { $lte: ["$quantity", "$thresholdValue"] },
      quantity: { $gt: 0 },
    }),

    // out of stock
    Product.find({ userID: userId, quantity: { $lte: 0 },availability:"out-of-stock"} ),

    // paginated products
    Product.find({ userID: userId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
  ]);

  const totalRevenue = revenueAgg[0]?.totalRevenue || 0;
  const totalPages = Math.ceil(totalProducts / limit);
   
   const data= {
      categoriesCount: categories.length,
      totalProducts,
      totalRevenue,
      topSelling:topSelling.length,
      lowStock:lowStock.length,
      outOfStock:outOfStock.length,
      pagination: {
        products: paginatedProducts,
        currentPage: Number(page),
        totalPages,
        hasNextPage: Number(page) < totalPages,
        hasPrevPage: Number(page) > 1,
      },
    }
 
return  res.status(200).json(new ApiResponse(200,data,"Product Page Info Fetched"));
});







export const decreaseProductQuantity=asyncHandler(async(req,res)=>{
  const { productID } = req.params; // product ID from URL
    const { decreaseBy } = req.body;   // amount to decrease

    if (!decreaseBy || decreaseBy <= 0) {
      return res.status(400).json({ message: "Invalid decrease amount" });
    }

    // Find the product
    const product = await Product.findById({_id:productID});
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Decrease quantity
    product.quantity -= decreaseBy;

    // Ensure quantity doesn't go below zero
    if (product.quantity <= 0) 
    { 
      product.quantity = 0;
    product.availability = "out-of-stock";

    }
    else if(product.quantity<product.thresholdValue) {
      product.availability="low-stock";
    }

    // Update availability based on new quantity
    

    // Save changes
    await product.save();

   return  res.status(200).json(new ApiResponse(200,product,"Product Quantity updated"));
})

