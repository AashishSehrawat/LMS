import express from "express";
import { createLecture, deleteLecture, editLecture, getLectureBycourseId, getLectureById } from "../controllers/lecture.controller.js";
import { verifyEducator, verifyJWT } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middlerware.js";

const lectureRouter = express.Router();

lectureRouter.post("/create/:courseId", verifyJWT, verifyEducator, createLecture);
lectureRouter.get("/get/:lectureId", verifyJWT, getLectureById);
lectureRouter.get("/course-lectures/:courseId", verifyJWT, getLectureBycourseId);
lectureRouter.put("/edit/:lectureId", verifyJWT, verifyEducator, upload.single('videoUrl'), editLecture);
lectureRouter.delete("/delete/:lectureId", verifyJWT, verifyEducator, deleteLecture);

export default lectureRouter;
  