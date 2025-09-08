import { Router } from "express";
import {uploadImage,uploadCSV} from "../middlewares/multer.middleware.js"
import { addProduct,uploadCSVProducts,decreaseProductQuantity ,getProductPageInfo} from "../controllers/product.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router=Router();

// router.post("/add-product",uploadImage.fields([{name:"productImage",maxCount:1}]),addProduct)
router.route("/add-product").post(verifyJWT, uploadImage.single("productImage"),addProduct)
// router.post("/add-product",uploadImage.fields([{name:"productImage",maxCount:1}]),addSingleProduct)
// router.post("/:id/upload-image", uploadImage.single("image"), uploadProductImage);

// router.post("/many-products",uploadCSV.single("file"),uploadCSVProducts)
router.route("/many-products").post(verifyJWT,uploadCSV.single("file"),uploadCSVProducts)
router.route("/decrease-quantity/:productID").patch(verifyJWT,decreaseProductQuantity)
// router.route("/paginated-products").get(verifyJWT,getPaginatedProducts)
router.route("/get-product-page-info").get(verifyJWT,getProductPageInfo)

export default router;  