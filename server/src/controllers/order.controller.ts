import razorpay from "razorpay";
import dotenv from "dotenv"
import type { Request, Response } from "express";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import Course from "../models/course.model.js";
import User from "../models/user.model.js";
dotenv.config()

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

const razorpayOrder = async (req: Request, res: Response) => {
    try {
        const { courseId } = req.body
        const course = await Course.findById(courseId)
        if(!course) {
            throw new ApiError(404, "Course not found")
        }
        const options : {
            amount: number,
            currency: string,
            receipt: string,
        } = {
            amount: course.price!*100,
            currency: "INR",
            receipt: `${courseId}.toString()`,
        }
        const order = await razorpayInstance.orders.create(options)
        return res.status(200).json(new ApiResponse(200, "Order created successfully", order))
    } catch (error) {
        console.log("Error in razorpayOrder", error)
        return res.status(400).json(new ApiError(400, "Error in razorpayOrder"))
    }
}

const verifyPayment = async (req: Request, res: Response) => {
    try {
        const { courseId, userId, razorpayOrderId } = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpayOrderId)
        if(orderInfo.status === "paid") {
            const user = await User.findById(userId)
            if(!user) {
                throw new ApiError(404, "User not found")
            }
            if(!user.enrollCourses.includes(courseId)) {
                user.enrollCourses.push(courseId)
            }
            const course = await Course.findById(courseId).populate("lectures")
            if(!course) {
                throw new ApiError(404, "Course not found")
            }
            if(!course.enrolledStudents.includes(userId)) {
                course.enrolledStudents.push(userId)
            }
            await user.save()
            await course.save()
            return res.status(200).json(new ApiResponse(200, "Payment verified successfully", user))
        } else {
            return res.status(400).json(new ApiError(400, "Payment failed"))
        }

    } catch (error) {
        console.log("Error in verifyPayment", error)
        return res.status(400).json(new ApiError(400, "Error in verifyPayment"))
    }
}


export {razorpayOrder, verifyPayment}
