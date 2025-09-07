import type { Request, Response } from "express"
import uploadOnCloudinary from "../config/cloudinary.js"
import User from "../models/user.model.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"

const getCurrentUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.user?._id).select("-password")
        console.log("User in get current user: ", user)
        if(!user) {
            throw new ApiError(404, "User not found")
        }
        return res
            .status(200)
            .json(new ApiResponse(200, "User profile fetched successfully", user))
    } catch (error) {
        console.log("Error in getCurrentUser", error)
        throw new ApiError(404, "Error in getCurrentUser")
    }
}

const updateProfile = async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body 
        let cloudinaryPhotoUrl;

        // Upload photo if file exists
        if (req.file) {
          const localFilePath = req.file.path;
          cloudinaryPhotoUrl = await uploadOnCloudinary(localFilePath);
        }

        if(!name && !description && !cloudinaryPhotoUrl) {
            throw new ApiError(400, "Name, description or photo is required")
        }

        console.log("Cloudinary photo url: ", cloudinaryPhotoUrl)

        const updatedData: any = {}
        if(name) updatedData.name = name
        if(description) updatedData.description = description
        if(cloudinaryPhotoUrl) updatedData.photoUrl = cloudinaryPhotoUrl

        const user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: updatedData
            },
            { new: true }
        ).select("-password")

        if(!user) {
            throw new ApiError(404, "User not found")
        }
        await user.save()
        return res
            .status(200)
            .json(new ApiResponse(200, "User profile updated successfully", user))
    } catch (error) {
        console.log("Error in updateProfile", error)
        throw new ApiError(404, "Error in updateProfile")
    }
}

export { getCurrentUser, updateProfile }
