import mongoose from "mongoose";

type IReview = {
    course: mongoose.Schema.Types.ObjectId;
    user: mongoose.Schema.Types.ObjectId;
    rating: number;
    comment?: string; 
    reviewDate: Date;
} 

interface IReviewDocument extends IReview, mongoose.Document {
    _id: mongoose.Schema.Types.ObjectId;
}

const reviewSchema = new mongoose.Schema<IReviewDocument>({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    rating: {
        type: Number,
        required: true,
        min: [1, "Rating must be at least 1"],
        max: [5, "Rating must be at most 5"]
    },
    comment: {
        type: String,
        trim: true
    },
    reviewDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})

const Review = mongoose.model<IReviewDocument>('Review', reviewSchema);

export default Review;
