import { asyncHandler } from "../utils/asyncHandler.js";


import { Product } from "../models/product.model.js";
import { Invoice } from "../models/invoice.model.js";



import { Dashboard } from "../models/dashboard.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const sumField = (arr, field) => arr.reduce((acc, item) => acc + (item[field] || 0), 0);

export const getFullDashboard = asyncHandler(async (req, res) => {


  const userId = req.user._id;
  const today = new Date();

 
  

  // --- Fetch products and invoices for this user ---
  const [products,fiveProducts, invoices, categories] = await Promise.all([
    Product.find({userID: userId }),
    Product.find({
  userID: userId,
  quantity: 0
})
.sort({ createdAt: -1 })
.limit(5),
    Invoice.find({userID: userId }).populate("products.product"),
    Product.distinct("category", {userID: userId })
  ]);


  const paidInvoices = invoices.filter(inv => inv.status === "Paid");
  const unPaidInvoices=invoices.filter((inv)=>inv.status==="Unpaid");

  // --- Sales Overview ---
  const totalRevenue = sumField(paidInvoices, "amount");
  const totalSales = totalRevenue;

  const totalCost = paidInvoices.reduce((acc, inv) => {
    return acc + inv.products.reduce((sum, p) => sum + (p.price * p.quantity || 0), 0);
  }, 0);

  const profit = totalRevenue*.15;

  // --- Purchase Overview ---
  const totalPurchase = products.length;
  const purchaseCost = sumField(products, "price");
  const canceled = 0; // can be updated with actual logic
  const returned = 0; // can be updated with actual logic

  // --- Inventory Summary ---
  const quantityInHand = sumField(products, "quantity");
  const toBeReceived = unPaidInvoices.length; // placeholder, update logic if needed

  // --- Product Summary ---
  const suppliers = invoices.length; // update if suppliers collection is added

  // --- Top 5 Products Sold ---
  const productSalesMap = {};
  paidInvoices.forEach(inv => {
    inv.products.forEach(p => {
      const productName = p.product?.productName || "Unknown";
      if (!productSalesMap[productName]) productSalesMap[productName] = 0;
      productSalesMap[productName] += p.quantity;
    });
  });
  const topProducts = fiveProducts;

  // --- Graphs ---
  const monthly = [];
  for (let m = 0; m < 12; m++) {
    const month = new Date(today.getFullYear(), today.getMonth() - m, 1);
    const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
    const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0, 23, 59, 59, 999);

    const salesTotal = paidInvoices
      .filter(inv => inv.createdAt >= monthStart && inv.createdAt <= monthEnd)
      .reduce((sum, inv) => sum + inv.amount, 0);

    const purchaseTotal = products
      .filter(p => p.createdAt >= monthStart && p.createdAt <= monthEnd)
      .reduce((sum, p) => sum + (p.price * (p.quantity || 1)), 0);

    monthly.unshift({
      name: monthStart.toLocaleString("default", { month: "short" }),
      sales: salesTotal,
      purchase: purchaseTotal
    });
  }

  const weekly = [];
  for (let i = 6; i >= 0; i--) {
    const day = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    const dayStart = new Date(day.setHours(0, 0, 0, 0));
    const dayEnd = new Date(day.setHours(23, 59, 59, 999));

    const salesTotal = paidInvoices
      .filter(inv => inv.createdAt >= dayStart && inv.createdAt <= dayEnd)
      .reduce((sum, inv) => sum + inv.amount, 0);

    const purchaseTotal = products
      .filter(p => p.createdAt >= dayStart && p.createdAt <= dayEnd)
      .reduce((sum, p) => sum + (p.price * (p.quantity || 1)), 0);

    weekly.push({ name: `Day ${7 - i}`, sales: salesTotal, purchase: purchaseTotal });
  }

  const yearly = [];
  for (let y = 0; y < 5; y++) {
    const yearStart = new Date(today.getFullYear() - y, 0, 1);
    const yearEnd = new Date(today.getFullYear() - y, 11, 31, 23, 59, 59, 999);

    const salesTotal = paidInvoices
      .filter(inv => inv.createdAt >= yearStart && inv.createdAt <= yearEnd)
      .reduce((sum, inv) => sum + inv.amount, 0);

    const purchaseTotal = products
      .filter(p => p.createdAt >= yearStart && p.createdAt <= yearEnd)
      .reduce((sum, p) => sum + (p.price * (p.quantity || 1)), 0);

    yearly.unshift({
      name: `${yearStart.getFullYear()}`,
      sales: salesTotal,
      purchase: purchaseTotal
    });
  }
  const data={
    success: true,
    salesOverview: { totalSales, totalRevenue, profit, totalCost },
    purchaseOverview: { totalPurchase, purchaseCost, canceled, returned },
    inventorySummary: { quantityInHand, toBeReceived },
    productSummary: { categories: categories.length, suppliers },
    topProducts,
    graphs: { monthly, weekly, yearly }
  }

return  res.status(200).json(new ApiResponse(200,data,"Dashboard Info Fetched"));
});





const setHomeLayout = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { overview, summary } = req.body;

  const dashboard = await Dashboard.findOneAndUpdate(
    { userID: userId },
    { overview, summary },
    { new: true, upsert: true }
  );

return  res.status(200).json(new ApiResponse(200,dashboard,"Dashboard Layout Updated"));
});


//   const userId = new mongoose.Types.ObjectId("68b41af3007cbc2b29cec5e6");
  

//   const dashboard = await Dashboard.findOne(
//     { userID: userId }
//   );


//   res.status(200).json(dashboard);
// });

export const getHomeLayout = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const dashboard = await Dashboard.findOne({ userID: userId });
   
  return res.status(200).json({
    overview: dashboard?.overview || [],   // if dashboard exists use its overview, else empty array
    summary: dashboard?.summary || [],     // same for summary
  });
});



export {setHomeLayout}

