import express from "express";
import { createReview, getReviews } from "../controllers/review.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create", verifyJWT, createReview);
router.get("/get", verifyJWT, getReviews);

export default router