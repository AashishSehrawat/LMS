import Header from "@/components/Header"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { usePublicCourses } from "@/hooks/usePublicCourses"
import { IndianRupee, Star } from "lucide-react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import type { RootState } from "../redux/store"
import type { ICourse } from "../types/apiResponseTypes"

const MyEnrolledCourses = () => {
    const publicCourses = usePublicCourses()
    const {user} = useSelector((state: RootState) => state.auth)
    const filteredCourses = publicCourses?.filter((course: ICourse) => course.enrolledStudents.includes(user?._id!))
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <h1 className="text-3xl font-bold text-foreground">My Enrolled Courses</h1>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 p-8 w-auto">
                    {filteredCourses?.map((course: any) => (
                        <Link key={course._id} to={`/course/${course._id}`}>
                            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <img className="w-full h-48 object-cover overflow-hidden rounded-lg" src={course.thumbnail} alt="" />
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-semibold">{course.title}</h3>
                                        <span className="text-xs text-muted-foreground bg-primary/10 px-2 py-1 rounded-full">{course.category}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-2 h-16">{course.description.length > 100 ? course.description.slice(0, 100) + "..." : course.description}</p>
                                    <div className="flex items-center gap-2 justify-between">
                                        <p className="text-muted-foreground mt-2 flex items-center">
                                            <IndianRupee />
                                            <span className="text-[24px]">{course.price}</span>
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <Star className="text-yellow-300 fill-yellow-300" size={16} />
                                            <span className="text-[16px] text-muted-foreground">{
                                                course.reviews.length === 0 ? 0 : course.reviews.reduce((acc: any, review: any) => acc + review.rating, 0) / course.reviews.length
                                            }</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MyEnrolledCourses