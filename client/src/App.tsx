import { lazy, Suspense, useEffect } from "react"
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"

import { useDispatch, useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import { EducatorRoute, UserRoute } from "./components/ProtectedRoute"
import { Spinner } from "./components/ui/shadcn-io/spinner"
import getCurrentUser from "./lib/getCurrentUser"
import type { AppDispatch, RootState } from "./redux/store"
import useGetAllReviews from "./hooks/useGetAllReviews"

const Home = lazy(() => import("./pages/Home"))
const Login = lazy(() => import("./pages/auth/Login"))
const Register = lazy(() => import("./pages/auth/Register"))
const NotFound = lazy(() => import("./pages/NotFound"))
const ForgetPassword = lazy(() => import("./pages/auth/ForgetPassword"))
const Profile = lazy(() => import("./pages/Profile"))
const UpdatePassword = lazy(() => import("./pages/auth/UpdatePassword"))
const OtpVerification = lazy(() => import("./pages/auth/OtpVerification"))
const EditProfile = lazy(() => import("./pages/EditProfile"))
const Dashboard = lazy(() => import("./pages/educator/Dashboard"))
const CreateCourse = lazy(() => import("./pages/educator/CreateCourse"))
const Courses = lazy(() => import("./pages/educator/Courses"))
const EditCourse = lazy(() => import("./pages/educator/EditCourse"))
const PublicCourses = lazy(() => import("./pages/PublicCourses"))
const CreateLecture = lazy(() => import("./pages/lecture/CreateLecture"))
const EditLecture = lazy(() => import("./pages/lecture/EditLecture"))
const ViewPublicCourse = lazy(() => import("./pages/ViewPublicCourse"))
const ViewLectures = lazy(() => import("./pages/ViewLectures"))
const MyEnrolledCourses = lazy(() => import("./pages/MyEnrolledCourses"))
const SearchWithAI = lazy(() => import("./pages/SearchWithAI"))

function App() {
  const { user, loading } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch<AppDispatch>()

  useGetAllReviews()

  useEffect(() => {
    dispatch(getCurrentUser())
  }, [dispatch])

  if (loading) {
    return <div className="flex items-center justify-center h-screen">
      <Spinner className="h-12 w-12" />
    </div>
  }

  return (
    <>
      <Router>
        <Suspense fallback={<div className="flex items-center justify-center h-screen">
          <Spinner className="h-12 w-12" />
        </div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchWithAI />} />
            <Route path="/courses" element={<PublicCourses />} />
            <Route path="/course/:courseId" element={<ViewPublicCourse />} />
            <Route path="/view-lectures/:courseId" element={<ViewLectures />} />
            <Route path="/my-courses" element={<MyEnrolledCourses />} />  

            {/* auth */}

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />

            <Route path="/password/forget" element={<ForgetPassword />} />
            <Route path="/password/update" element={<UpdatePassword />} />
            <Route path="/otp/verify" element={<OtpVerification />} />

            <Route element={<UserRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/edit" element={<EditProfile />} />
            </Route>

            <Route element={<EducatorRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/create-course" element={<CreateCourse />} />
              <Route path="/dashboard/courses" element={<Courses />} />
              <Route path="/dashboard/edit-course/:id" element={<EditCourse />} />
            </Route>

            <Route element={<EducatorRoute />}>
              <Route path="/dashboard/create-lecture/:courseId" element={<CreateLecture />} />
              <Route path="/dashboard/edit-lecture/:lectureId" element={<EditLecture />} />
            </Route>


            {/* not found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </>
  )
}

export default App
