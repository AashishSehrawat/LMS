import express from "express";
import { razorpayOrder, verifyPayment } from "../controllers/order.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router()

router.post("/razorpay-order", verifyJWT, razorpayOrder)
router.post("/verify-payment", verifyJWT, verifyPayment)

export default router