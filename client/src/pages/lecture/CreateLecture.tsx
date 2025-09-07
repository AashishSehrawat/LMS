import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, SquarePen, Upload } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { useState } from "react"
import axios from "axios"
import { setLectures } from "@/redux/reducer/lecture.reducer"
import { toast } from "sonner"
import { useEffect } from "react"

const CreateLecture = () => {
    const { courseId } = useParams()
    const navigate = useNavigate()
    const { lectures } = useSelector((state: any) => state.lectures)
    const [lectureTitle, setLectureTitle] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const dispatch = useDispatch()

    const getLectures = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_SERVER_URI}/api/lecture/course-lectures/${courseId}`, {
                withCredentials: true
            })
            if (res?.data?.success) {
                dispatch(setLectures(res.data.data))
            } else {
                toast.error(res?.data?.data?.message || "Failed to get lectures")
            }
        } catch (error) {
            console.log("Error in getLectures", error)
            toast.error("Failed to get lectures")
        }
    }

    useEffect(() => {
        getLectures()
    }, [courseId])

    const handleAddLecture = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const res = await axios.post(`${import.meta.env.VITE_SERVER_URI}/api/lecture/create/${courseId}`, {
                lectureTitle,
            }, {
                withCredentials: true
            })
            console.log("res", res)
            if (res?.data?.success) {
                dispatch(setLectures([...lectures, res.data.data]))
                toast.success("Lecture created successfully")
                setLectureTitle("")
                await getLectures()
            } else {
                toast.error(res?.data?.data?.message || "Failed to create lecture")
            }
        } catch (error) {
            console.log("Error in handleAddLecture", error)
            toast.error("Failed to create lecture")
        }
        setIsLoading(false)
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div>
                    <h1 className="text-4xl font-semibold mb-2">Let's Add a Lecture</h1>
                    <p className="text-muted-foreground">Enter the title and add your vedio lecture to enhance your course</p>
                </div>
                <form onSubmit={handleAddLecture}>
                    <Input
                        type="text"
                        placeholder="e.g. Introduction to MERN Stack"
                        className="mt-4"
                        required
                        value={lectureTitle}
                        onChange={(e) => setLectureTitle(e.target.value)}
                    />
                    <div>
                        <Button
                            className="mr-4"
                            variant="outline"
                            onClick={() => navigate(-1)}
                        >
                            <ArrowLeft className="h-4 w-4" />Back to Courses
                        </Button>
                        <Button
                            className="mt-4"
                            type="submit"
                            disabled={isLoading}
                        >
                            <Upload className="h-4 w-4" />{isLoading ? "Adding..." : "Add Lecture"}
                        </Button>
                    </div>
                </form>

                <div className="mt-8 space-y-4">
                    {Array.isArray(lectures) &&
                        lectures.map((lecture: any, index: number) => (
                            <div key={lecture._id} className="p-4 bg-muted flex items-center justify-between rounded-lg">
                                <span className="text-lg">Lecture-{index + 1} {lecture.lectureTitle}</span>
                                <Button className="gap-2 cursor-pointer hover:bg-primary/80" onClick={() => navigate(`/dashboard/edit-lecture/${lecture._id}`)}>
                                    <SquarePen />
                                </Button>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default CreateLecture