import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
// import { getInvoiceDashboardForUser ,markInvoiceAsPaid,getPaginatedInvoicesForUser,deleteInvoice,viewInvoice} from "../controllers/invoice.controller.js";
import {getStatistics,setStatisticsLayout,getStatisticsLayout} from "../controllers/statistics.controller.js"
const router=Router();

// router.route("/get-invoice-page-info").get(getInvoiceDashboardForUser)
// router.route("/paid/:invoiceID").patch(markInvoiceAsPaid)
// router.route("/view/:invoiceID").patch(viewInvoice)
// router.route("/delete/:invoiceID").delete(deleteInvoice)
// router.route("/pagination").get(getPaginatedInvoicesForUser)

router.route("/get-details").get(verifyJWT,getStatistics)
router.route("/save-layout").put(verifyJWT,setStatisticsLayout)
router.route("/get-layout").get(verifyJWT,getStatisticsLayout)

export default router 