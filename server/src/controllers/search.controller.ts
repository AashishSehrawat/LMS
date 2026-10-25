import type { Request, Response } from "express"
import ApiError from "../utils/ApiError.js"
import Course from "../models/course.model.js"
import ApiResponse from "../utils/ApiResponse.js"
import { GoogleGenAI } from "@google/genai"
import dotenv from "dotenv"
dotenv.config()

/** Escape special regex chars to avoid MongoDB regex injection errors */
const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

const searchWithAI = async (req: Request, res: Response) => {
    try {
        const { query } = req.body
        if (!query || !query.trim()) {
            throw new ApiError(400, "Search query is required")
        }

        const safeQuery = escapeRegex(query.trim())

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
        Query: ${query.trim()}
        `

        const aiResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        // Trim to remove trailing newlines/whitespace that would break the regex
        const keyword = aiResponse.text?.trim() ?? ""
        const safeKeyword = escapeRegex(keyword)
        console.log("AI keyword:", JSON.stringify(keyword))

        // First: try matching by original query text (title, category, description, etc.)
        const coursesByQuery = await Course.find({
            isPublished: true,
            $or: [
                { title: { $regex: safeQuery, $options: "i" } },
                { category: { $regex: safeQuery, $options: "i" } },
                { subTitle: { $regex: safeQuery, $options: "i" } },
                { description: { $regex: safeQuery, $options: "i" } },
                { level: { $regex: safeQuery, $options: "i" } },
            ]
        })

        if (coursesByQuery.length > 0) {
            return res
                .status(200)
                .json(new ApiResponse(200, "Courses fetched successfully", coursesByQuery))
        }

        // Fallback: use AI-extracted keyword if original query had no match
        const coursesByKeyword = safeKeyword
            ? await Course.find({
                isPublished: true,
                $or: [
                    { title: { $regex: safeKeyword, $options: "i" } },
                    { category: { $regex: safeKeyword, $options: "i" } },
                    { subTitle: { $regex: safeKeyword, $options: "i" } },
                    { description: { $regex: safeKeyword, $options: "i" } },
                    { level: { $regex: safeKeyword, $options: "i" } },
                ]
            })
            : []

        return res
            .status(200)
            .json(new ApiResponse(200, "Courses fetched successfully", coursesByKeyword))

    } catch (error: any) {
        console.log("Error in searchWithAI", error)
        throw new ApiError(error?.statusCode || 500, error?.message || "Error in search")
    }
}

export { searchWithAI }