import express from "express"
import { createCourse, deleteCourse, editCourse, getCourseById, getCreatorCourses, getPublicCourses } from "../controllers/course.controller.js"
import { verifyJWT, verifyEducator } from "../middleware/auth.middleware.js"
import upload from "../middleware/multer.middlerware.js"
import { searchWithAI } from "../controllers/search.controller.js"

const router = express.Router()

router.post("/create", verifyJWT, verifyEducator, createCourse)
router.get("/public", getPublicCourses)
router.get("/educator", verifyJWT, getCreatorCourses)
router.get("/:id", getCourseById)
router.put("/edit/:id", verifyJWT, verifyEducator, upload.single('thumbnail'), editCourse)
router.delete("/delete/:id", verifyJWT, verifyEducator, deleteCourse)
router.post("/search", searchWithAI)

export default router

 