import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { getCurrentUser, updateProfile } from "../controllers/user.controller.js";
import upload from "../middleware/multer.middlerware.js";

const router = express.Router();

router.get('/getCurrentUser', verifyJWT, getCurrentUser)
router.put('/updateProfile',verifyJWT, upload.single('photoUrl'), updateProfile)

export default router;
