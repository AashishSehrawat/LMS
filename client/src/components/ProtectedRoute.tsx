import { useSelector } from "react-redux"
import type { RootState } from "../redux/store"
import { Navigate, Outlet } from "react-router-dom"
import { toast } from "sonner"
import { Spinner } from "./ui/shadcn-io/spinner"

const UserRoute = () => {
    const { user, loading } = useSelector((state: RootState) => state.auth)
    if (loading) {
        return <div className="flex items-center justify-center h-screen">
            <Spinner className="h-12 w-12" />
        </div>
    }
    if (!user) {
        toast.error("Please login to access this page")
        return <Navigate to="/login" />
    }
    return (
        <Outlet />
    )
}

const GuestRoute = () => {
    const { user } = useSelector((state: RootState) => state.auth)
    if (user) {
        toast.error("Please logout to access this page")
        return <Navigate to="/" />
    }
    return (
        <Outlet />
    )
}

const EducatorRoute = () => {
    const { user } = useSelector((state: RootState) => state.auth)
    if (!user) {
        toast.error("Please login to access this page")
        return <Navigate to="/login" />
    }
    if (user.role !== "educator") {
        toast.error("You are not authorized to access this page")
        return <Navigate to="/" />
    }
    return (
        <Outlet />
    )
}

export { UserRoute, GuestRoute, EducatorRoute }