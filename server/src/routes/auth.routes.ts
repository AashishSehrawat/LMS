import express from "express";
import { googleAuthLogin, googleAuthRegister, loginUser, logoutUser, registerUser, resetPassword, sendOTP, verifyOPT } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/logout', verifyJWT, logoutUser)
router.post('/send-otp', sendOTP)
router.post('/verify-otp', verifyOPT)
router.post('/reset-password', resetPassword)
router.post('/google-auth-register', googleAuthRegister)
router.post('/google-auth-login', googleAuthLogin)


export default router;
