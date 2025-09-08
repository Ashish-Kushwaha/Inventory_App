import { Router } from "express";
import { registerUser,loginUser,logoutUser,sendMail,verifyOTP,createNewPassword,editUserInfo } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router =Router();

router.route("/register").post(registerUser)

router.route("/login").post(loginUser) 
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/send-mail").post(sendMail);
router.route("/verify-otp").post(verifyOTP);
router.route("/reset-password").post(createNewPassword);
router.route("/edit-user-info").patch(verifyJWT,editUserInfo);


export default router 