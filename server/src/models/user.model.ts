import mongoose, { Types } from "mongoose";

interface IUser {
    name: string;
    description?: string;
    email: string;
    password?: string;
    role: 'student' | 'educator';
    photoUrl?: string;
    enrollCourses: mongoose.Schema.Types.ObjectId[];
    resetOtp?: string | undefined;
    otpExpiry?: Date | undefined;
    isOtpVerified?: boolean;
}

interface IUserDocument extends IUser, Document {
    _id: Types.ObjectId;
}

const userSchema = new mongoose.Schema<IUserDocument>({
    name: { 
        type: String, 
        required: true, 
        trim: true,
    },
    description: { 
        type: String, 
        trim: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true, 
        lowercase: true,
        validate: {
            validator: (v: string) => /^\S+$/u.test(v),
            message: 'Email cannot contain whitespace',
        },
    },
    password: { 
        type: String,
        min: [6, "Password must be at least 6 characters long"],
        max: [20, "Password must be at most 20 characters long"],
    },
    role: { 
        type: String, 
        required: true, 
        enum: ['student', 'educator'], 
    },
    photoUrl: { 
        type: String,
        default: ""
    },
    enrollCourses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course"   
        }
    ],
    resetOtp: { 
        type: String,
        default: ""
    },
    otpExpiry: { 
        type: Date,
        default: Date.now
    },
    isOtpVerified: { 
        type: Boolean,
        default: false
    }
 });

const User = mongoose.model<IUserDocument>('User', userSchema);

export default User;

export type {IUserDocument, IUser}

