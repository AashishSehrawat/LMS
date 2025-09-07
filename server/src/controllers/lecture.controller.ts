import type { Request, Response } from "express";
import Lecture from "../models/lecture.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Course from "../models/course.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";

const createLecture = async (req: Request, res: Response) => {
    try {
        const {lectureTitle} = req.body;
        const {courseId} = req.params;
 
        if(!courseId) {
            throw new ApiError(400, "Course id is required")
        }

        const course = await Course.findById(courseId)
        if(!course) {
            throw new ApiError(404, "Course not found")
        }

        if(!lectureTitle) {
            throw new ApiError(400, "Lecture title is required")
        }
        const lecture = await Lecture.create({
            lectureTitle,
        });
        course.lectures.push(lecture._id)
        await course.populate("lectures")
        await course.save()
 

        return res
            .status(201)
            .json(new ApiResponse(201, "Lecture created successfully", lecture))
    } catch (error) {
        console.log("Error in createLecture", error)
        throw new ApiError(400, "Error in creating lecture")
    }
}

const getLectureById = async (req: Request, res: Response) => {
    try {
        const lectureId = req.params?.lectureId
        const lecture = await Lecture.findById(lectureId)
        if(!lecture) {
            throw new ApiError(404, "Lecture not found")
        }
        return res
            .status(200)
            .json(new ApiResponse(200, "Lecture fetched successfully", lecture))
    } catch (error) {
        console.log("Error in getLectureById", error)
        throw new ApiError(400, "Error in fetching lecture")
    }
}

const getLectureBycourseId = async (req: Request, res: Response) => {
    try {   
        const courseId = req.params?.courseId
        const course = await Course.findById(courseId).populate("lectures")
 
        if(!course) {
            throw new ApiError(404, "Course not found")
        }
      
        return res
            .status(200)
            .json(new ApiResponse(200, "Lecture fetched successfully", course.lectures))
    } catch (error) {
        console.log("Error in gerLectureById", error)
        throw new ApiError(400, "Error in fetching lecture")
    }
}

const editLecture = async (req: Request , res: Response) => {
    try {
        const {lectureTitle, isPreviewFree} = req.body;
        const {lectureId} = req.params;

        let cloudinaryVideoUrl;
        if(req.file) {
            const localFilePath = req.file.path;
            cloudinaryVideoUrl = await uploadOnCloudinary(localFilePath);
        }

        if(!req.file) console.log("No file uploaded in edit lecture")

        if(!lectureTitle && !isPreviewFree && !cloudinaryVideoUrl) {
            throw new ApiError(400, "Lecture title or isPreviewFree or videoUrl is required")
        }

        const updatedData: any = {}
        if(lectureTitle != undefined) updatedData.lectureTitle = lectureTitle
        if(isPreviewFree != undefined) updatedData.isPreviewFree = isPreviewFree
        if(cloudinaryVideoUrl) updatedData.videoUrl = cloudinaryVideoUrl

        const updatedLecture = await Lecture.findByIdAndUpdate(
            lectureId,
            {
                $set: updatedData
            },
            { new: true }
        )

        return res
            .status(200)
            .json(new ApiResponse(200, "Lecture updated successfully", updatedLecture))
    } catch (error) {
        console.log("Error in editLecture", error)
        throw new ApiError(400, "Error in updating lecture")
    }
}

const deleteLecture = async (req: Request, res: Response) => {
    try {
        const {lectureId} = req.params;
        const lecture = await Lecture.findByIdAndDelete(lectureId)
        if(!lecture) {
            throw new ApiError(404, "Lecture not found")
        }
        await Course.updateMany({
            lectures: lectureId
        }, {
            $pull: {
                lectures: lectureId
            }
        })

        return res
            .status(200)
            .json(new ApiResponse(200, "Lecture deleted successfully", lecture))
    } catch (error) {
        console.log("Error in deleteLecture", error)
        throw new ApiError(400, "Error in deleting lecture")
    }
}




export {createLecture, getLectureBycourseId, editLecture, deleteLecture, getLectureById}