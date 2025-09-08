import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getInvoiceDashboardForUser ,markInvoiceAsPaid,deleteInvoice,viewInvoice,downloadInvoice} from "../controllers/invoice.controller.js";
const router=Router();

router.route("/get-invoice-page-info").get(verifyJWT,getInvoiceDashboardForUser)
router.route("/paid/:invoiceID").patch(verifyJWT,markInvoiceAsPaid)
router.route("/view/:invoiceID").patch(verifyJWT,viewInvoice)
router.route("/delete/:invoiceID").delete(verifyJWT,deleteInvoice)

router.route("/download/:invoiceid").get(verifyJWT,downloadInvoice)
export default router  