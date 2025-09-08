import { asyncHandler } from "../utils/asyncHandler.js";


import { Invoice } from "../models/invoice.model.js";
import {Product} from "../models/product.model.js";

import mongoose from "mongoose";
import { Statistics } from "../models/statistics.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
// Helper to calculate % increase
const calculatePercentageIncrease = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

export const getStatistics = asyncHandler(async (req, res) => {
  const userID = req.user._id;
  const today = new Date();
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const startOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [
    totalRevenueCurrentMonth,
    totalRevenueLastMonth,
    productsSoldCurrentMonth,
    productsSoldLastMonth,
    productsInStockCurrent,
    productsInStockLastMonth,
    weeklySales,
    monthlySales,
    yearlySales,
    topProducts,
  ] = await Promise.all([
    // Total revenue this month
    Invoice.aggregate([
      { $match: { userID, status: "Paid", createdAt: { $gte: startOfThisMonth, $lte: today } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),

    // Total revenue last month
    Invoice.aggregate([
      { $match: { userID, status: "Paid", createdAt: { $gte: lastMonth, $lt: startOfThisMonth } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),

    // Products sold this month
    Invoice.aggregate([
      { $match: { userID, status: "Paid", createdAt: { $gte: startOfThisMonth, $lte: today } } },
      { $unwind: "$products" },
      { $group: { _id: null, totalSold: { $sum: "$products.quantity" } } },
    ]),

    // Products sold last month
    Invoice.aggregate([
      { $match: { userID, status: "Paid", createdAt: { $gte: lastMonth, $lt: startOfThisMonth } } },
      { $unwind: "$products" },
      { $group: { _id: null, totalSold: { $sum: "$products.quantity" } } },
    ]),

    // Products in stock now
    Product.aggregate([
      { $match: { userID } },
      { $group: { _id: null, totalInStock: { $sum: "$quantity" } } },
    ]),

    // Products in stock same day last month
    Product.aggregate([
      { $match: { userID, createdAt: { $lt: startOfThisMonth } } },
      { $group: { _id: null, totalInStock: { $sum: "$quantity" } } },
    ]),

    // Weekly sales (last 7 days)
    Invoice.aggregate([
      { $match: { userID, status: "Paid", createdAt: { $gte: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: { $dayOfWeek: "$createdAt" }, totalSales: { $sum: "$amount" } } },
      { $sort: { "_id": 1 } },
    ]),

    // Monthly sales (last 12 months)
    Invoice.aggregate([
      { $match: { userID, status: "Paid", createdAt: { $gte: new Date(today.getFullYear(), today.getMonth() - 11, 1) } } },
      { $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          totalSales: { $sum: "$amount" }
      } },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]),

    // Yearly sales (last 5 years)
    Invoice.aggregate([
      { $match: { userID, status: "Paid", createdAt: { $gte: new Date(today.getFullYear() - 5, 0, 1) } } },
      { $group: { _id: { year: { $year: "$createdAt" } }, totalSales: { $sum: "$amount" } } },
      { $sort: { "_id.year": 1 } },
    ]),

    // Top 5 sold products
    Invoice.aggregate([
      { $match: { userID, status: "Paid" } }, 
      { $unwind: "$products" },
      { $group: { _id: "$products.product", totalSold: { $sum: "$products.quantity" } } },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "productDetails" } },
      { $unwind: "$productDetails" },
      { $project: { productName: "$productDetails.productName", totalSold: 1 } },
    ]),
  ]);
   const data={
    success: true,
    statistics: {
      totalRevenue: totalRevenueCurrentMonth[0]?.total || 0,
      revenueIncreasePercent: calculatePercentageIncrease(
        totalRevenueCurrentMonth[0]?.total || 0,
        totalRevenueLastMonth[0]?.total || 0
      ),
      productsSold: productsSoldCurrentMonth[0]?.totalSold || 0,
      productsSoldIncreasePercent: calculatePercentageIncrease(
        productsSoldCurrentMonth[0]?.totalSold || 0,
        productsSoldLastMonth[0]?.totalSold || 0
      ),
      productsInStock: productsInStockCurrent[0]?.totalInStock || 0,
      productsInStockIncreasePercent: calculatePercentageIncrease(
        productsInStockCurrent[0]?.totalInStock || 0,
        productsInStockLastMonth[0]?.totalInStock || 0
      ),
    },
    graphs: { weeklySales, monthlySales, yearlySales },
    topProducts,
  }
  return res.status(200).json(new ApiResponse(200,data,"Statistics Page Info Fetched"));
});


const setStatisticsLayout = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  console.log(userId)
 
  const { mainTiles, smallTiles } = req.body;

  const dashboard = await Statistics.findOneAndUpdate(
    { userID: userId },
    { mainTiles, smallTiles },
    { new: true, upsert: true }
  );

  res.status(200).json(new ApiResponse(200,dashboard,"Statistics Layout Updated"));
});


export const getStatisticsLayout = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const statisticsLayout = await Statistics.findOne({ userID: userId });

  res.status(200).json({
    mainTiles: statisticsLayout?.mainTiles || [],   // if dashboard exists use its overview, else empty array
    smallTiles: statisticsLayout?.smallTiles || [],     // same for summary
  });
});

export {setStatisticsLayout} 