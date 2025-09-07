import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { RootState } from "@/redux/store";
import { BookOpen, IndianRupee, Plus, Users } from "lucide-react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import educationLogo from "@/assets/logo.jpg";
import { usePublicCourses } from "@/hooks/usePublicCourses";
import type { ICourse } from "@/types/apiResponseTypes";

const chartConfig = {
  progress: {
    label: "Course Progress",
    color: "black",
  },
  students: {
    label: "Student Enrollment",
    color: "black",
  },
};

const EducatorDashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth)
  const navigate = useNavigate()
  const courses = usePublicCourses();

  const filteredCourses = courses?.filter((course: ICourse) => course.creator === user?._id)
  // console.log("filteredCourses", filteredCourses)

  const courseProgressData: { course: string; lectureCount: number }[] = [];
  filteredCourses?.forEach((course: any) => {
    courseProgressData.push({ course: course.title, lectureCount: course.lectures?.length })
  })

  const studentEnrollmentData: { course: string; students: number }[] = [];
  filteredCourses?.forEach((course: any) => {
    studentEnrollmentData.push({ course: course.title, students: course.enrolledStudents?.length })
  })

  // console.log("studentEnrollmentData", studentEnrollmentData)

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
          <div className="flex items-center space-x-2">
            <Button className="gap-2 cursor-pointer hover:bg-primary/80" onClick={() => navigate('/dashboard/courses')}>
              Uploaded Courses
            </Button>
            <Button className="gap-2 cursor-pointer hover:bg-primary/80" onClick={() => navigate('/dashboard/create-course')}>
              <Plus className="h-4 w-4" />
              Create Course
            </Button>
          </div>

        </div>

        {/* Profile Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={user?.photoUrl}
                  alt="Educator"
                />
                <AvatarFallback className="text-4xl">{user?.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">{user?.name}</h2>
                  <p className="text-muted-foreground">{user?.role}</p>
                </div>

                <p className="text-foreground leading-relaxed max-w-2xl">
                  {user?.description}
                </p>

                <div className="flex items-center gap-2 text-2xl font-bold text-primary">
                  <IndianRupee className="h-6 w-6" />
                  <span>
                    {filteredCourses?.reduce(
                      (acc: number, course: any) =>
                        acc + (course.enrolledStudents?.length || 0) * (course.price || 0),
                      0
                    )}
                  </span>
                  <span className="text-sm font-normal text-muted-foreground">Total Earnings</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{filteredCourses?.length}</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{filteredCourses?.reduce((acc: any, course: any) => acc + course.enrolledStudents?.length, 0)}</div>
              <p className="text-xs text-muted-foreground">+140 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">85%</div>
              <p className="text-xs text-muted-foreground">+5% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Course Progress Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Course Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="w-full h-[350px]">
                <LineChart data={courseProgressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="course"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="lectureCount"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Student Enrollment Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Student Enrollment</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="w-full h-[350px]" >
                <BarChart accessibilityLayer data={studentEnrollmentData}>
                  <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="course"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="students" fill="black" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EducatorDashboard;