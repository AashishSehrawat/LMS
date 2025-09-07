import { createSlice } from "@reduxjs/toolkit";
import type { ILecture } from "@/types/apiResponseTypes";

interface LectureState {
    lectures: ILecture[] | null,
    loading: boolean
}

const initialState: LectureState = {
    lectures: [],
    loading: true
}

const lectureSlice = createSlice({
    name: "lectures",
    initialState,
    reducers: {
        setLectures: (state, action) => {
            state.lectures = action.payload
            state.loading = false
        },
    },
})

export const { setLectures } = lectureSlice.actions
export default lectureSlice.reducer
