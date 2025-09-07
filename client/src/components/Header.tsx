import educationLogo from "@/assets/logo.jpg";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/redux/reducer/auth.reducer";
import type { RootState } from "@/redux/store";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { RxHamburgerMenu } from "react-icons/rx";


const Header = () => {
    const { user } = useSelector((state: RootState) => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_SERVER_URI}/api/auth/logout`, {
                withCredentials: true,
            })
            if (res?.data?.success) {
                dispatch(logoutUser())
                toast.success("Logout Successfully")
                navigate('/')
            } else {
                toast.error(res?.data?.data?.message || "Failed to logout")
            }
        } catch (error) {
            console.log("Error in logoutHandler", error)
            toast.error("Logout Failed")
        }
    }

    return (
        <header className="bg-background border-b border-border shadow-soft sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
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

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link to="/"
                            onClick={(e) => {
                                e.preventDefault()
                                navigate("/", { state: { scrollTo: "home" } })
                            }}
                            className="text-foreground hover:text-primary transition-colors duration-200 font-medium">
                            Home
                        </Link>
                        <Link to="/courses"
                            className="text-foreground hover:text-primary transition-colors duration-200 font-medium">
                            Courses
                        </Link>
                        <Link
                            to="#"
                            onClick={(e) => {
                                e.preventDefault()
                                navigate("/", { state: { scrollTo: "about" } })
                            }}
                            className="text-foreground hover:text-primary transition-colors duration-200 font-medium">
                            About
                        </Link>
                        <Link
                            to="#"
                            onClick={(e) => {
                                e.preventDefault()
                                navigate("/", { state: { scrollTo: "features" } })
                            }}
                            className="text-foreground hover:text-primary transition-colors duration-200 font-medium">
                            Features
                        </Link>
                    </nav>

                    {/* Desktop Auth Buttons */}
                    {
                        user?._id ? (
                            // Show logout button if user exists
                            <>
                                <div className="hidden md:flex items-center space-x-3">
                                    {
                                        user.role === "educator" && (
                                            <div>
                                                <Button
                                                    onClick={() => navigate('/dashboard')}
                                                    className="text-black bg-white hover:bg-black hover:text-white border-1 cursor-pointer"
                                                >
                                                    Dashboard
                                                </Button>
                                            </div>
                                        )
                                    }
                                    {/* <div>
                                        <Button
                                            onClick={logoutHandler}
                                            className="text-black bg-white hover:bg-black hover:text-white border-1 cursor-pointer"
                                        >
                                            Logout
                                        </Button>
                                    </div> */}
                                    <div className="ml-1">
                                        <Popover>
                                            <PopoverTrigger>
                                                {
                                                    user.photoUrl !== "" ? (
                                                        <img src={user.photoUrl} alt="user photo" className="w-6 h-6 rounded-full cursor-pointer" />
                                                    ) : (
                                                        <div className="w-6 h-6 rounded-full cursor-pointer bg-black text-white flex items-center justify-center">{user?.name.charAt(0).toUpperCase()}</div>
                                                    )
                                                }
                                            </PopoverTrigger>
                                            <PopoverContent className="border-1 bg-white p-4 rounded-lg mt-2">
                                                <div className="flex flex-col gap-2">
                                                    <Button className="cursor-pointer border-1 hover:bg-white hover:text-black" onClick={() => navigate('/profile')}>My Profile</Button>
                                                    <Button className="cursor-pointer border-1 hover:bg-white hover:text-black" onClick={() => navigate('/my-courses')}>My Courses</Button>
                                                    <Button onClick={logoutHandler} className="cursor-pointer border-1 hover:bg-white hover:text-black">Logout</Button>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>

                            </>
                        ) : (
                            // Show login/register if no user
                            <div className="hidden md:flex items-center space-x-3">
                                <Link to="/login">
                                    <Button className="text-black bg-white hover:bg-black hover:text-white border-1 cursor-pointer">
                                        Login
                                    </Button>
                                </Link>
                                <Link to="/register">
                                    <Button className="hover:bg-white hover:text-black border-1 cursor-pointer">
                                        Register
                                    </Button>
                                </Link>
                            </div>
                        )
                    }

                    {/* Mobile Menu */}
                    <div className="md:hidden">
                        <Popover>
                            <PopoverTrigger>
                                <RxHamburgerMenu className="cursor-pointer w-6 h-6" />
                            </PopoverTrigger>
                            <PopoverContent className="border-1 bg-white p-4 rounded-lg mt-2">
                                <div className="flex flex-col gap-2">
                                    {
                                        !user && <>
                                            <Button className="cursor-pointer border-1 hover:bg-white hover:text-black" onClick={() => navigate('/login')}>Login</Button>
                                            <Button className="cursor-pointer border-1 hover:bg-white hover:text-black" onClick={() => navigate('/register')}>Register</Button>
                                        </>
                                    }
                                    {
                                        user?.role === "educator" && (
                                            <Button className="cursor-pointer border-1 hover:bg-white hover:text-black">Dashboard</Button>
                                        )
                                    }
                                    <Button className="cursor-pointer border-1 hover:bg-white hover:text-black">Courses</Button>
                                    {
                                        user && <>
                                            <Button className="cursor-pointer border-1 hover:bg-white hover:text-black" onClick={() => navigate('/profile')}>My Profile</Button>
                                            <Button className="cursor-pointer border-1 hover:bg-white hover:text-black" onClick={() => navigate('/my-courses')}>My Courses</Button>
                                            <Button onClick={logoutHandler} className="cursor-pointer border-1 hover:bg-white hover:text-black">Logout</Button>
                                        </>
                                    }
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>

                </div>
            </div>
        </header>
    );
};

export default Header;