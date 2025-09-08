import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getFullDashboard,setHomeLayout ,getHomeLayout} from "../controllers/home.controller.js";

const router=Router();
 
router.route("/get-page-info").get(verifyJWT,getFullDashboard)
router.route("/save-layout").put(verifyJWT,setHomeLayout)
router.route("/get-layout").get(verifyJWT,getHomeLayout)

export default router 