import { Button } from "@/components/ui/button"
import { IndianRupee, Plus, SquarePen } from "lucide-react"
import { Link } from "react-router-dom"
import educationLogo from "@/assets/logo.jpg"
import { useNavigate } from "react-router-dom"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useCallback } from "react"
import axios from "axios"
import { toast } from "sonner"
import { useDispatch, useSelector } from "react-redux"
import { setCourse } from "@/redux/reducer/course.reducer"
import type { RootState } from "@/redux/store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const Courses = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { courses } = useSelector((state: RootState) => state.courses)

  const fetchCourses = useCallback(async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URI}/api/course/educator`, {
        withCredentials: true
      })
      if (res?.data?.success) {
        console.log("res", res?.data?.data)
        dispatch(setCourse(res?.data?.data))
      } else {
        toast.error(res?.data?.data?.message || "Failed to fetch courses")
      }
    } catch (error) {
      console.log("Error in fetchCourses", error)
      toast.error("Failed to fetch courses")
    }
  }, [dispatch])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])


  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <Link to="/">
            <div className="flex items-center space-x-3">
              <img
                src={educationLogo}
                alt="LearnWise"
                className="h-10 w-10 object-contain"
              />
              <span className="text-xl font-bold text-foreground">
                Learn<span className="text-primary">Wise</span>
              </span>
            </div>
          </Link>
          <Button className="gap-2 cursor-pointer hover:bg-primary/80" onClick={() => navigate('/dashboard/create-course')}>
            <Plus className="h-4 w-4" />
            Create Course
          </Button>
        </div>

        {/* Courses */}
        <div className="">
          <Table>
            <TableCaption>A list of your recent courses.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-auto text-[18px]">Course</TableHead>
                <TableHead className="w-[100px] text-[18px] hidden md:table-cell">Price</TableHead>
                <TableHead className="w-[100px] text-[18px] hidden md:table-cell">Status</TableHead>
                <TableHead className="w-[100px] text-[18px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses?.map((course) => (
                <TableRow key={course._id}>
                  <TableCell className="font-medium flex items-center gap-6">
                    <Avatar className="w-20 h-20 border-2 border-primary/10 rounded-lg">
                        <AvatarImage src={course.thumbnail} alt={course.title} />
                        <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-primary to-primary-glow text-primary-foreground rounded-lg">
                            {course.title?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    {course.title}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center">
                      {
                        !course.price ? (
                          <span>-----</span>
                        ) : (
                          <div className="flex items-center">
                            <IndianRupee className="h-3 w-3" />{course.price}
                          </div>
                        )
                      }
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{
                    <span className="text-green-500">
                      {course.isPublished ? (
                        <span className="text-green-500">Published</span>
                      ) : (
                        <span className="text-red-500">Draft</span>
                      )}
                    </span>
                  }</TableCell>
                  <TableCell className="">
                    <Button className="gap-2 cursor-pointer hover:bg-primary/80" onClick={() => navigate(`/dashboard/edit-course/${course?._id}`)}>
                      <SquarePen />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export default Courses