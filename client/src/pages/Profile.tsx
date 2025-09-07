import Header from "@/components/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BookOpen, Clock, Edit, Mail } from "lucide-react";
import { useSelector } from "react-redux"
import type { RootState } from "../redux/store"
import { useNavigate } from "react-router-dom"

const Profile = () => {
  // Mock user data - in a real app, this would come from a state management solution or API
  const { user } = useSelector((state: RootState) => state.auth)
  const navigate = useNavigate()

  const userI = {
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    bio: "Passionate learner and software developer with a keen interest in modern web technologies. Always excited to explore new frameworks and build innovative solutions.",
    enrolledCourses: [
      {
        id: 1,
        title: "Advanced React Development",
        progress: 75,
        instructor: "Sarah Chen",
        duration: "8 weeks",
        status: "In Progress"
      },
      {
        id: 2,
        title: "TypeScript Fundamentals",
        progress: 100,
        instructor: "Mike Torres",
        duration: "6 weeks",
        status: "Completed"
      },
      {
        id: 3,
        title: "Node.js Backend Development",
        progress: 45,
        instructor: "David Kim",
        duration: "10 weeks",
        status: "In Progress"
      },
      {
        id: 4,
        title: "Database Design & SQL",
        progress: 30,
        instructor: "Lisa Rodriguez",
        duration: "7 weeks",
        status: "In Progress"
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      <Header />
      <div className="max-w-4xl mx-auto space-y-8 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <Button className="hover:shadow-glow cursor-pointer transition-all duration-300" onClick={() => navigate('/profile/edit')}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </div>

        {/* User Info Card */}
        <Card className="border-0 shadow-elegant">
          <CardHeader className="pb-4">
            <div className="flex items-start gap-6">
              <Avatar className="w-24 h-24 border-4 border-primary/10">
                <AvatarImage src={user?.photoUrl} alt={user?.name} />
                <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
                  {user?.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{user?.name} <span className="text-muted-foreground font-semibold text-sm">({user?.role})</span></h2>
                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                    <Mail className="h-4 w-4" />
                    <span>{user?.email}</span>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed max-w-2xl">
                  {user?.description}
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Enrolled Courses */}
        <Card className="border-0 shadow-elegant">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-semibold text-foreground">Enrolled Courses</h3>
              <Badge variant="secondary" className="ml-2">
                {userI.enrolledCourses.length} courses
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {userI.enrolledCourses.map((course) => (
                <Card key={course.id} className="border border-border/50 hover:border-primary/20 transition-colors">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h4 className="font-semibold text-foreground leading-tight">
                          {course.title}
                        </h4>
                        <Badge className={getStatusColor(course.status)}>
                          {course.status}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Instructor:</span>
                          <span>{course.instructor}</span>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{course.duration}</span>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium text-foreground">{course.progress}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-primary-glow transition-all duration-500"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-0 shadow-elegant">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {user?.enrollCourses.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Courses</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-elegant">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {userI.enrolledCourses.filter(c => c.status === "Completed").length}
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-elegant">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {Math.round(userI.enrolledCourses.reduce((acc, c) => acc + c.progress, 0) / userI.enrolledCourses.length)}%
              </div>
              <div className="text-sm text-muted-foreground">Average Progress</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;