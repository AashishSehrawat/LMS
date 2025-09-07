import mongoose, { Document } from "mongoose";

interface ICourse {
    title: string;
    subTitle?: string;
    description?: string;
    category: string;
    level?: "Beginner" | "Intermediate" | "Advanced";
    price?: number;
    thumbnail: string;
    enrolledStudents: mongoose.Schema.Types.ObjectId[];
    lectures: mongoose.Schema.Types.ObjectId[];
    creator: mongoose.Schema.Types.ObjectId;
    isPublished: boolean;
    reviews: mongoose.Schema.Types.ObjectId[];
}

interface ICourseDocument extends ICourse, Document {
    _id: mongoose.Schema.Types.ObjectId;
}

const courseSchema = new mongoose.Schema<ICourseDocument>({
    title: {
        type: String,
        required: true,
        min: [3, "Name must be at least 3 characters long"],
        max: [100, "Name must be at most 100 characters long"],
        trim: true,
    },
    subTitle: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    category: {
        type: String,
        trim: true,
        required: true
    },
    level: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced"],
    },
    price: {
        type: Number, 
    },
    thumbnail: {
        type: String
    },
    enrolledStudents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    ],
    lectures: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lecture"
        },
    ],
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        },
    ],
}, { timestamps: true });

const Course = mongoose.model<ICourseDocument>('Course', courseSchema);

export default Course;