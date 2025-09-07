export type IUser = {
    _id: string;
    name: string;
    email: string;
    password?: string;
    role: 'student' | 'educator';
    photoUrl?: string;
    enrollCourses: string[];
    resetOtp?: string;
    optExpiry?: Date;
    isOtpVerified?: boolean;
    description?: string;
}

export type ICourse = {
    _id: string;
    title: string;
    subTitle?: string;
    description?: string;
    category: string;
    level: "Beginner" | "Intermediate" | "Advanced";
    price: number;
    creator: IUser | any;
    enrolledStudents: string[];
    lecturer: string[];
    reviews: any[];
    thumbnail: string;
    isPublished: boolean;
}

export type ILecture = {
    _id: string;
    lectureTitle: string;
    videoUrl: string;
    isPreviewFree: boolean;
}

export type IReview = {
    _id: string;
    course: string;
    rating: number;
    comment?: string;
    user: IUser;
    reviewDate: Date;
}

export type LogoutResponse = {
    success: boolean;
    message: string;
    data?: IUser;
    statusCode?: number;
}

export type RegisterResponse = {
    success: boolean;
    message: string;
    data?: IUser;
    statusCode?: number;
}

export type LoginResponse = {
    success: boolean;
    message: string;
    data?: IUser;
    statusCode?: number;
}