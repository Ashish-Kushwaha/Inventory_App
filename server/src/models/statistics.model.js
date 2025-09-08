import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
  id: { type: String, required: true },   // e.g. "sales-overview"
  label: { type: String, required: true } // e.g. "Sales Overview"
});

const statisticsSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User",unique:true, required: true },
  mainTiles: [cardSchema],
  smallTiles: [cardSchema]
}, { timestamps: true });

export const Statistics= mongoose.model("Statistics", statisticsSchema);
