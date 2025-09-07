import Header from "@/components/Header"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import { useState } from "react"
import { PlayCircle } from "lucide-react"
import type { ICourse } from "@/types/apiResponseTypes"
import axios from "axios"
import { useParams } from "react-router-dom"
import { useEffect } from "react"
import { setLectures } from "@/redux/reducer/lecture.reducer"

const ViewLectures = () => {
    const { lectures } = useSelector((state: RootState) => state.lectures)
    const [selectedLecture, setSelectedLecture] = useState(0)
    const [course, setCourse] = useState<ICourse | null>(null)
    const { courseId } = useParams();
    const dispatch = useDispatch()

    const getCourseById = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URI}/api/course/${courseId}`, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true
            });
            if (response.data.success) {
                setCourse(response.data.data)
            } else {
                console.error("Error fetching course:", response.data.message);
            }
        } catch (error) {
            console.error("Error fetching course:", error);
        }
    };

    const getLecturesByCouresId = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_SERVER_URI}/api/lecture/course-lectures/${courseId}`, {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true
          });
          if (response.data.success) {
            dispatch(setLectures(response.data.data))
          } else {
            console.error("Error fetching lectures:", response.data.message);
          }
        } catch (error) {
          console.error("Error fetching lectures:", error);
        }
      }
    
      useEffect(() => {
        getCourseById();
        getLecturesByCouresId();
      }, [courseId]);

    console.log("lectures", lectures)
    return (
        lectures?.length === 0 ? (
            <div>
                <Header />
                <h1 className="text-2xl font-bold text-center mt-12">No lectures found</h1>
            </div>
        ) : (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="container mx-auto px-4 py-8 max-w-7xl">
                    <div>
                        {course && (
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h1 className="text-2xl font-bold">{course.title}</h1>
                                    <p className="text-muted-foreground bg-muted px-2 py-1 rounded-full w-fit">{course.category}</p>
                                </div>
                                <p className="text-muted-foreground">{course.description}</p>
                            </div>
                        )}
                    </div>
                    <section>
                        <div className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <Card className="sticky top-4">
                                    <CardContent className="">
                                        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                                            {lectures?.[selectedLecture]?.videoUrl ? (
                                                <video src={lectures?.[selectedLecture]?.videoUrl} controls className="w-full h-full rounded-lg" />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center">
                                                    <PlayCircle className="w-12 h-12 text-muted-foreground" />
                                                    <p className="text-muted-foreground">No video available</p>
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="font-semibold mb-2">{lectures?.[selectedLecture]?.lectureTitle}</h3>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="lg:col-span-1 max-h-[calc(100vh-8rem)] overflow-y-auto sticky top-4 z-10 scrollbar-hide">
                                <div className="space-y-4">
                                    <Card>
                                        <CardHeader>
                                            Lecture
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                {lectures?.map((lecture, index) => (
                                                    <div
                                                        key={lecture._id}
                                                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${selectedLecture === index ? "bg-primary/10" : "hover:bg-muted/50"}`}
                                                        onClick={() => {
                                                            setSelectedLecture(index)
                                                        }}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <span className="">
                                                                {lecture?.lectureTitle}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        )
    )
}

export default ViewLectures