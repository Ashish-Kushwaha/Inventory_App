// cron/expiryCheck.js
import cron from "node-cron";
import {Product} from "../models/product.model.js";

export const expiryCheckJob = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const now = new Date();
      await Product.updateMany(
        { expiryDate: { $lt: now } },
        { $set: { availability: "expired" } }
      );
      console.log("✅ Expired products updated");
    } catch (err) {
      console.error("❌ Expiry check failed:", err);
    }
  });
};
