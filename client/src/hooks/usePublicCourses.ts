// src/hooks/usePublicCourses.ts
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setPublicCourse } from "@/redux/reducer/course.reducer";
import type { RootState } from "@/redux/store";

export function usePublicCourses() {
    const dispatch = useDispatch();
    const { publicCourses, flagForPublicCourses } = useSelector((state: RootState) => state.courses);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_SERVER_URI}/api/course/public`);
                if (res.data.success) {
                    dispatch(setPublicCourse(res.data.data));
                }
            } catch (error) {
                console.error("Error fetching public courses:", error);
            }
        }
        fetchCourses();
    }, [dispatch, flagForPublicCourses]);

    return publicCourses;
}
