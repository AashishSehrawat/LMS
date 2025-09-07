import type { ICourse } from "@/types/apiResponseTypes";
import { createSlice } from "@reduxjs/toolkit";

interface CourseState {
    courses: ICourse[] | null,
    publicCourses: ICourse[] | null,
    flagForPublicCourses: number,
    loading: boolean
}

const initialState: CourseState = {
    courses: [],
    publicCourses: [],
    flagForPublicCourses: 0,
    loading: true
}

const courseSlice = createSlice({
    name: "courses",
    initialState,
    reducers: {
        setCourse: (state, action) => {
            state.courses = action.payload
            state.loading = false
        },
        setPublicCourse: (state, action) => {
            state.publicCourses = action.payload
            state.loading = false
        },
        triggerPublicCourseRefresh: (state) => {
            state.flagForPublicCourses += 1
        }
    },
})

export const { setCourse, setPublicCourse, triggerPublicCourseRefresh } = courseSlice.actions
export default courseSlice.reducer
