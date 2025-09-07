import type { Request, Response } from "express"
import ApiError from "../utils/ApiError.js"
import Course from "../models/course.model.js"
import ApiResponse from "../utils/ApiResponse.js"
import { GoogleGenAI } from "@google/genai"
import dotenv from "dotenv"
dotenv.config()

const searchWithAI = async (req: Request, res: Response) => {
    try {
        const { query } = req.body
        if (!query) {
            throw new ApiError(400, "Input is required")
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

        const prompt = `You are an intelligent assistant for an LMS platform. A user type any query about what they want to learn. Your task is to understand the intent and return one **most relevant keyword** from the following list of course categories and levels:
            - App Development
            - Web Development
            - Data Science
            - Machine Learning
            - AI
            - Artificial Intelligence
            - Cybersecurity
            - Blockchain
            - Ethical Hacking
            - UI UX Design
            - Beginner
            - Intermediate
            - Advanced
        Only reply with one single keyword from the list above that best matches the query. Do not explain anything. No extra text.
        Query: ${query}
        `

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        console.log("keyword from AI", response.text);
        const keyword = response.text 
        const courses = await Course.find({
            isPublished: true,
            $or: [
                { title: { $regex: query, $options: "i" } },
                { category: { $regex: query, $options: "i" } },
                { subTitle: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } },
                { level: { $regex: query, $options: "i" } },
            ]
        })

        if(courses.length > 0) {
            return res
                .status(200)
                .json(new ApiResponse(200, "Courses fetched successfully", courses))
        } else {
            const courses = await Course.find({
                isPublished: true,
                $or: [
                    { title: { $regex: keyword, $options: "i" } },
                    { category: { $regex: keyword, $options: "i" } },
                    { subTitle: { $regex: keyword, $options: "i" } },
                    { description: { $regex: keyword, $options: "i" } },
                    { level: { $regex: keyword, $options: "i" } },
                ]
            })
            return res
                .status(200)
                .json(new ApiResponse(200, "Courses fetched successfully", courses))
        }
    } catch (error) {
        console.log("Error in searchWithAI", error)
        throw new ApiError(400, "Error in searchWithAI")
    }
}

export { searchWithAI }