import Review from "../models/review.model.js";
import type { Request, Response } from "express";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Course from "../models/course.model.js";

const createReview = async (req: Request, res: Response) => {
    try {
        const { courseId, rating, comment } = req.body;
        const userId = req.user?._id;

        const course = await Course.findById(courseId);
        if(!course) {
            throw new ApiError(404, "Course not found")
        }

        const alreadyReviewed = await Review.findOne({ course: courseId, user: userId })
        if(alreadyReviewed) {
            return res.status(400).json(new ApiError(400, "You have already reviewed this course"))
        }

        const review = new Review({ 
            course: courseId, 
            rating, 
            comment, 
            user: userId 
        });
        await review.save();

        course.reviews.push(review._id)
        await course.save()

        return res
            .status(201)
            .json(new ApiResponse(201, "Review created successfully", review))
    } catch (error) {
        console.log("Error in createReview", error)
        throw new ApiError(400, "Error in creating review")
    }
}

const getReviews = async (req: Request, res: Response) => {
    try {
        const reviews = await Review.find({}).populate("user").sort({ reviewDate: -1 })
        if(!reviews) {
            throw new ApiError(404, "Reviews not found")
        }
        return res
            .status(200)
            .json(new ApiResponse(200, "Reviews fetched successfully", reviews))
    } catch (error) {
        console.log("Error in getReviews", error)
        throw new ApiError(400, "Error in getting reviews")
    }
}


export { createReview, getReviews }