import type { Request, Response } from "express"
import Course from "../models/course.model.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import uploadOnCloudinary from "../config/cloudinary.js"

const createCourse = async (req: Request, res: Response) => {
    try {
        const {title, category} = req.body;
        console.log("first")
        if(!title || !category) {
            throw new ApiError(400, "All fields are required")
        }
        console.log("second")
        const course = await Course.create({
            title, 
            category, 
            creator: req.user?._id
        })
        console.log("course", course)
        return res
            .status(201)
            .json(new ApiResponse(201, "Course created successfully", course))
    } catch (error) {
        console.log("Error in createCourse", error)
        throw new ApiError(400, "Error in creating course")
    }
}

const getPublicCourses = async (req: Request, res: Response) => {
    try {
        const courses = await Course.find({ isPublished: true }).populate("reviews")
        if(!courses) {
            throw new ApiError(404, "Courses not found")
        }
        return res
            .status(200)
            .json(new ApiResponse(200, "Courses fetched successfully", courses))
    } catch (error) {
        console.log("Error in getPublicCourses", error)
        throw new ApiError(400, "Error in fetching public courses")
    }
}

const getCreatorCourses = async (req: Request, res: Response) => {
    try {
        const courses = await Course.find({ creator: req.user?._id })
        if(!courses) {
            throw new ApiError(404, "Courses not found")
        }
        return res
            .status(200)
            .json(new ApiResponse(200, "Courses fetched successfully", courses))
    } catch (error) {
        console.log("Error in getCreatorCourses", error)
        throw new ApiError(400, "Error in fetching creator courses")
    }
}

const editCourse = async (req: Request, res: Response) => {
    try {
        const courseId = req.params?.id
        const {
            title, 
            subTitle, 
            description, 
            category, 
            level, 
            price, 
            isPublished
        } = req.body
        let cloudinaryThumbnailUrl;

        // if(!req.file) console.log("No file uploaded")
       
        if(req.file) {
            const localFilePath = req.file.path;
            cloudinaryThumbnailUrl = await uploadOnCloudinary(localFilePath);
        }

        const updatedData: any = {}
        if(title) updatedData.title = title
        if(category) updatedData.category = category
        if(subTitle) updatedData.subTitle = subTitle
        if(description) updatedData.description = description
        if(level) updatedData.level = level
        if(price) updatedData.price = price
        if(isPublished) updatedData.isPublished = isPublished
        if(cloudinaryThumbnailUrl) updatedData.thumbnail = cloudinaryThumbnailUrl

        const course = await Course.findByIdAndUpdate(
            courseId,
            {
                $set: updatedData
            },
            { new: true }
        )
        return res
            .status(200)
            .json(new ApiResponse(200, "Course updated successfully", course))
    } catch (error) {
        console.log("Error in editCourse", error)
        throw new ApiError(400, "Error in editing course")
    }
}

const getCourseById = async (req: Request, res: Response) => {
    try {
        const courseId = req.params?.id
        const course = await Course.findById(courseId).populate("creator reviews")
        if(!course) {
            throw new ApiError(404, "Course not found")
        }
        return res
            .status(200)
            .json(new ApiResponse(200, "Course fetched successfully", course))
    } catch (error) {
        console.log("Error in getCourseById", error)
        throw new ApiError(400, "Error in fetching course")
    }
}

const deleteCourse = async (req: Request, res: Response) => {
    try {
        const courseId = req.params?.id
        const course = await Course.findByIdAndDelete(courseId, { new: true })
        if(!course) {
            throw new ApiError(404, "Course not found")
        }
        return res
            .status(200)
            .json(new ApiResponse(200, "Course deleted successfully", course))
    } catch (error) {
        console.log("Error in deleteCourse", error)
        throw new ApiError(400, "Error in deleting course")
    }
}

export { createCourse, getPublicCourses, getCreatorCourses, editCourse, getCourseById, deleteCourse }