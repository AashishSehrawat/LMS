import mongoose from "mongoose";

interface ILecture {
    lectureTitle: string;
    videoUrl?: string;
    isPreviewFree: boolean;
}

interface ILectureDocument extends ILecture, mongoose.Document {
    _id: mongoose.Schema.Types.ObjectId;
}

const lectureSchema = new mongoose.Schema<ILectureDocument>({
    lectureTitle: {
        type: String,
        required: true,
        trim: true,
    },
    videoUrl: {
        type: String,
    },
    isPreviewFree: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

const Lecture = mongoose.model("Lecture", lectureSchema)
export default Lecture