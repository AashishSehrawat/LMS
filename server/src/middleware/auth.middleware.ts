import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";

const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) {
            return res.status(401).json(new ApiError(401, "Unauthorized"))
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as jwt.JwtPayload

        const userId: string = decodedToken?.userId as string
        const user = await User.findById(userId).select("-password")
        if(!user){
            return res.status(401).json(new ApiError(401, "User not found"))
        }
        req.user = user
        next()
    } catch (error) {
        console.log("Error in verifyJWT middleware", error)
        return res.status(401).json(new ApiError(401, "Unauthorized"))
    }
}

const verifyEducator = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user
        if (!user) {
            return res.status(401).json(new ApiError(401, "User not found"))
        }
        if (user.role !== "educator") {
            return res.status(401).json(new ApiError(401, "Unauthorized access"))
        }
        next()
    } catch (error) {
        console.log("Error in verifyEducator middleware", error)
        return res.status(401).json(new ApiError(401, "Unauthorized access"))
    }
}

export { verifyJWT, verifyEducator }