import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
  id: { type: String, required: true },   // e.g. "sales-overview"
  label: { type: String, required: true } // e.g. "Sales Overview"
});

const dashboardSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User",unique:true, required: true },
  overview: [cardSchema],
  summary: [cardSchema]
}, { timestamps: true });

export const Dashboard= mongoose.model("Dashboard", dashboardSchema);
