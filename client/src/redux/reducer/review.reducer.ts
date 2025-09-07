import { createSlice } from "@reduxjs/toolkit"
import type { IReview } from "@/types/apiResponseTypes"

interface ReviewState {
    reviews: IReview[] | null,
    loading: boolean
}

const initialState: ReviewState = {
    reviews: [],
    loading: true
}

const reviewSlice = createSlice({
    name: "review",
    initialState,
    reducers: {
        setReviewData: (state, action) => {
            state.reviews = action.payload
            state.loading = false
        }
    }
})
 
export const { setReviewData } = reviewSlice.actions
export default reviewSlice.reducer
