import bcrypt from "bcryptjs"
import type { Request, Response } from "express"
import jwt from "jsonwebtoken"
import validator from "validator"
import sendEmail from "../config/sendEmail.js"
import User from "../models/user.model.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"

const generateAccessToken = async (userId: string) => {
    try {
        const accessToken = jwt.sign(
            {
                userId
            },
            process.env.ACCESS_TOKEN_SECRET as string,
            {
                expiresIn: "7d"
            }
        )
        console.log("accessToken in generateAccessToken function : ", accessToken)
        return accessToken
    } catch (error) {
        console.log("Error in generateAccessToken", error)
        throw new ApiError(400, "Error in Token generation")
    }
}

const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body
        if ([name, password, email, role].some((feild) => feild?.trim === "")) {
            throw new ApiError(400, "All fields are required")
        }

        const existedUser = await User.findOne({ email })
        if (existedUser) {
            throw new ApiError(400, "User already exists")
        }

        if (!validator.isEmail(email)) {
            throw new ApiError(400, "Invalid email")
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({ name, email, password: hashedPassword, role })
        const accessToken = await generateAccessToken(user._id.toString())

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        req.user = user

        return res
            .status(201)
            .json(new ApiResponse(201, "User registered successfully", user))
    } catch (error) {
        console.log("Error in registerUser", error)
        throw new ApiError(400, "Error in registerUser")
    }
}

const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        if ([email, password].some((feild) => feild?.trim === "")) {
            throw new ApiError(400, "All fields are required")
        }
        const user = await User.findOne({ email })
        if (!user) {
            throw new ApiError(400, "User not found")
        }
        const isPasswordMatched = await bcrypt.compare(password, user.password as string)
        if (!isPasswordMatched) {
            throw new ApiError(400, "Invalid password")
        }

        const accessToken = await generateAccessToken(user._id.toString())
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        req.user = user
        return res
            .status(200)
            .json(new ApiResponse(200, "User logged in successfully", user))
    } catch (error) {
        console.log("Error in loginUser", error)
        throw new ApiError(400, "Error in loginUser")
    }
}

const logoutUser = async (req: Request, res: Response) => {
    try {
        const user = req.user
        if (!user) {
            throw new ApiError(400, "User not found")
        }

        res.clearCookie("accessToken")
        return res
            .status(200)
            .json(new ApiResponse(200, "User logged out successfully", user))
    } catch (error) {
        console.log("Error in logoutUser", error)
        throw new ApiError(400, "Error in logoutUser")
    }
}

const sendOTP = async (req: Request, res: Response) => {
    try {
        const { email } = req.body
        if (!email) {
            throw new ApiError(400, "Email is required")
        }
        const user = await User.findOne({ email })
        if (!user) {
            throw new ApiError(400, "User not found")
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        user.resetOtp = otp
        user.otpExpiry = new Date(Date.now() + .5 * 60 * 1000)
        user.isOtpVerified = false
        await user.save()
        await sendEmail({ to: email, otp })

        return res
            .status(200)
            .json(new ApiResponse(200, "OTP sent successfully", user))
    } catch (error) {
        console.log("Error in sendOTP", error)
        throw new ApiError(400, "Error in sendOTP")
    }
}

const verifyOPT = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body
        if ([email, otp].some((feild) => feild?.trim === "")) {
            throw new ApiError(400, "All fields are required")
        }

        const user = await User.findOne({ email })
        if (!user || user.resetOtp !== otp) {
            throw new ApiError(400, "Invalid OTP")
        }

        if (!user.otpExpiry) {
            throw new ApiError(400, "Invalid OTP")
        }

        if (user.otpExpiry && user.otpExpiry.getTime() < Date.now()) {
            throw new ApiError(400, "Invalid OTP")
        }
        user.isOtpVerified = true
        user.resetOtp = undefined
        user.otpExpiry = undefined
        await user.save()
        return res
            .status(200)
            .json(new ApiResponse(200, "OTP verified successfully", user))
    } catch (error) {
        console.log("Error in verifyOPT", error)
        throw new ApiError(400, "Error in verifyOPT")
    }
}

const resetPassword = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        if ([email, password].some((feild) => feild?.trim === "")) {
            throw new ApiError(400, "All fields are required")
        }
        const user = await User.findOne({ email })
        if (!user || !user.isOtpVerified) {
            throw new ApiError(400, "OTP verfication is required")
        } 
        const hashedPassword = await bcrypt.hash(password, 10)
        user.password = hashedPassword
        user.isOtpVerified = false
        await user.save()
        return res
            .status(200)
            .json(new ApiResponse(200, "Password reset successfully", user))
    } catch (error) {
        console.log("Error in resetPassword", error)
        throw new ApiError(400, "Error in resetPassword")
    }
}

const googleAuthRegister = async (req: Request, res: Response) => {
    try {
        const { email, name , role } = req.body
        if ([email, name, role].some((feild) => feild?.trim === "")) {
            throw new ApiError(400, "All fields are required")
        }
        let user = await User.findOne({ email })
        if (!user) {
            user = await User.create({ email, name, role })
        } 
        const accessToken = await generateAccessToken(user._id.toString())
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        req.user = user
        return res
            .status(200)
            .json(new ApiResponse(200, "Google Auth Success", user))
    } catch (error) {
        console.log("Error in googleAuth", error)
        throw new ApiError(400, "Error in googleAuth")
    }
}

const googleAuthLogin = async (req: Request, res: Response) => {
    try {
        const { email } = req.body
        if ([email].some((feild) => feild?.trim === "")) {
            throw new ApiError(400, "Email is required")
        }
        let user = await User.findOne({ email })
        if (!user) {
            throw new ApiError(400, "User not found")
        } 
        const accessToken = await generateAccessToken(user._id.toString())
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        req.user = user
        return res
            .status(200)
            .json(new ApiResponse(200, "Google Auth Success", user))
    } catch (error) {
        console.log("Error in googleAuth", error)
        throw new ApiError(400, "Error in googleAuth")
    }
}


export { googleAuthLogin, googleAuthRegister, loginUser, logoutUser, registerUser, resetPassword, sendOTP, verifyOPT }

