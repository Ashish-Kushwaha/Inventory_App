import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

import { Invoice } from "../models/invoice.model.js";

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Helper to generate unique reference number
const generateReferenceNumber = async () => {
  const randomPart = Math.floor(100 + Math.random() * 900); // 6-digit random number
  const exists = await Invoice.findOne({ referenceNumber: `INV-${randomPart}` });
  if (exists) return generateReferenceNumber(); // ensure uniqueness
  return `INV-${randomPart}`;
};


export const markInvoiceAsPaid = asyncHandler(async (req, res) => {
  const { invoiceID } = req.params;
  // const userId = req.user._id;
  const userId = req.user._id;

  // Find invoice for current user
  const invoice = await Invoice.findOne({ _id: invoiceID, userID: userId });

  if (!invoice) {
    return res.status(404).json({ success: false, message: "Invoice not found" });
  }

  if (invoice.status === "Paid") {
    return res.status(400).json({ success: false, message: "Invoice already marked as Paid" });
  }

  // Generate unique reference number
  const referenceNumber = await generateReferenceNumber();

  // Update invoice
  invoice.status = "Paid";
  invoice.referenceNumber = referenceNumber;
  await invoice.save();
  res.status(200).json(200,invoice,"Invoice updated to Paid successfully");
});




export const getInvoiceDashboardForUser = asyncHandler(async (req, res) => {
 
  const userId = req.user._id;
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = 9;

  const today = new Date();
  const last7Days = new Date();
  last7Days.setDate(today.getDate() - 7);

  // 1️⃣ Parallel DB calls filtered by userID
  const [
    totalInvoices,
    paidData,
    unpaidData,
    recentTransactions,
    paginatedInvoices,
    last7DaysOverview,
    processedData,
  ] = await Promise.all([
    // Total invoice count
    Invoice.countDocuments({ userID: userId }),

    // Paid invoices summary
    Invoice.aggregate([
      { $match: { status: "Paid", userID: userId } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          totalInvoices: { $sum: 1 },
        },
      },
    ]),

    // Unpaid invoices summary
    Invoice.aggregate([
      { $match: { status: "Unpaid", userID: userId } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          pendingPayments: { $sum: 1 },
        },
      },
    ]),

    // Recent 5 transactions
    Invoice.find({ userID: userId,status:"Paid" })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("products.product", "productName productID price"),

    // Paginated invoices
    Invoice.find({ userID: userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("products.product", "productName productID price"),

    // Last 7 days overview
    Invoice.aggregate([
      {
        $match: {
          createdAt: { $gte: last7Days, $lte: today },
          userID: userId,
        },
      }, 
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$createdAt" },
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          totalAmount: { $sum: "$amount" },
          totalInvoices: { $sum: 1 },
          paidInvoices: {
            $sum: { $cond: [{ $eq: ["$status", "Paid"] }, 1, 0] },
          },
          unpaidInvoices: {
            $sum: { $cond: [{ $eq: ["$status", "Unpaid"] }, 1, 0] },
          },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]),

    // Processed invoices summary
    Invoice.aggregate([
      { $match: { userID: userId } },
      {
        $group: {
          _id: null,
          totalProcessed: { $sum: "$processed" },
        },
      },
    ]),
  ]);

  const totalPages = Math.ceil(totalInvoices / limit);
  const data={
    success: true,
    summary: {
      totalInvoices,
      paidAmount: paidData[0]?.totalAmount || 0,
      totalCustomers: paidData[0]?.totalInvoices || 0,
      unpaidAmount: unpaidData[0]?.totalAmount || 0,
      pendingPayments: unpaidData[0]?.pendingPayments || 0,
      processed: processedData[0]?.totalProcessed || 0, // ✅ added processed summary
    },
    recentTransactions:recentTransactions.length,
    paginatedInvoices: {
      currentPage: page,
      totalPages,
      invoices: paginatedInvoices.map((inv) => ({
        ...inv.toObject(),
        processed: inv.processed, // ✅ include processed per invoice
      })),
      hasPrev: page > 1,
      hasNext: page < totalPages,
    },
    last7DaysOverview,
  }
  return res.status(200).json(new ApiResponse(200,data,"Invoice Dashboard Fetched"));
});




export const deleteInvoice = asyncHandler(async (req, res) => {
  const { invoiceID } = req.params; // invoiceID from URL
  
  const invoice = await Invoice.findById(invoiceID);
  if (!invoice) {
    throw new ApiError(404, "Invoice not found");
  }

  await invoice.deleteOne(); // delete the invoice

return  res.status(200).json(200,{},"Invoice deleted successfully");
});



export const viewInvoice = asyncHandler(async (req, res) => {
  const { invoiceID } = req.params; // invoiceID from URL

  
  const viewedInvoice=await Invoice.find({_id:invoiceID,processed:1});
   if(viewedInvoice.length>0){

    return res.status(201).json(new ApiResponse(201,{},"Invoice already processed"))
   }
  const invoice = await Invoice.findOneAndUpdate(
    { _id:invoiceID },
    { $inc: { processed: 1 } },
    { new: true } // return updated document
  );

  if (!invoice) {
    throw new ApiError(404, "Invoice not found");
  }
   
return  res.status(200).json(new ApiResponse(200,invoice,"Invoice Processed successfully"));
});


import PDFDocument from "pdfkit";
import { format } from "date-fns";
import "pdfkit-table"; // important to import after pdfkit
  // console.log(typeof PDFDocument.prototype.table);
export const downloadInvoice = asyncHandler(async (req, res) => {
  const { invoiceid } = req.params;
  console.log("Generating PDF for invoiceID:", invoiceid);

  // Find invoice with products
  const invoice = await Invoice.findById(invoiceid).populate(
    "products.product",
    "productName unit"
  );

  if (!invoice) {
    return res.status(404).json({ message: "Invoice not found" });
  }
  console.log(invoice); 
  // Response headers for download
  res.setHeader("Content-Disposition", `attachment; filename=${invoiceid}.pdf`);
  res.setHeader("Content-Type", "application/pdf");

  const doc = new PDFDocument({ margin: 30 });
  doc.pipe(res);

  // ---- HEADER ----
  doc.fontSize(20).text(`Invoice: ${invoice._id}`, { underline: true });
  doc.moveDown();

  doc.fontSize(12).text(`Reference Number: ${invoice.referenceNumber || "N/A"}`);
  doc.text(`Status: ${invoice.status}`);
  doc.text(`Due Date: ${format(invoice.dueDate, "dd/MM/yy")}`);
  doc.text(`Created At: ${format(invoice.createdAt, "dd/MM/yy")}`);
  doc.moveDown();

 
  const table = {
  headers: ["#", "Product", "Qty", "Unit", "Price", "Total"],
  rows: invoice.products.map((item, index) => [
    index + 1,
    item.productName || item.product?.productName || "N/A", // 👈 fallback
    item.quantity,
    item.product?.unit || "N/A",
    `Rs${item.price?.toFixed(2) || "0.00"}`,
    `Rs${(item.quantity * item.price).toFixed(2)}`,
  ]),
};
    console.log("Table rows:", table.rows);
    doc.table(table, {
    prepareHeader: () => doc.font("Helvetica-Bold").fontSize(12),
    prepareRow: (row, i) => doc.font("Helvetica").fontSize(10),
    columnSpacing: 10,
    padding: 5,
  });

  doc.moveDown();
  doc.fontSize(14).text(`Total Amount: Rs${invoice.amount.toFixed(2)}`, {
    align: "right",
    bold: true,
  });

  // ---- FOOTER ----
  doc.moveDown(2);
  invoice.products.forEach((item, index) => {   
  doc.text(
    `${index + 1}. ${item.productName} | Qty: ${item.quantity} | Unit: ${item.product?.unit || "N/A"} | Price: Rs${item.price.toFixed(2)} | Total: Rs${(item.quantity * item.price).toFixed(2)}`
  );
});
  doc.fontSize(10).text("Thank you for your business!", {
    align: "center",
    italic: true,
  });

  doc.end();
});
 