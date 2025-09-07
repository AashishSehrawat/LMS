import { setReviewData } from "@/redux/reducer/review.reducer"
import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"

const useGetAllReviews = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        const allReviews = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_SERVER_URI}/api/review/get`, {withCredentials: true})
                if(res.data.success) {
                    dispatch(setReviewData(res.data.data))
                    // console.log("all revirws", res.data.data)
                }
            } catch (error) {
                console.log("Error in custom useGetAllReviews hook", error)
            }
        }

        allReviews();
    }, [])
}

export default useGetAllReviews