import educationLogo from "@/assets/logo.jpg"
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { setUser } from '@/redux/reducer/auth.reducer'
import { zodResolver } from "@hookform/resolvers/zod"
import { ToggleGroup, ToggleGroupItem } from "@radix-ui/react-toggle-group"
import axios from "axios"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { IoEye, IoEyeOff } from "react-icons/io5"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from "zod"
import { auth, provider } from '@/lib/firebase'
import { signInWithPopup } from "firebase/auth"

const formSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters."),
    email: z.email({ message: "Please enter a valid email address." }),
    password: z.string().min(6, "Password must be at least 6 characters."),
    role: z.enum(["student", "educator"])
})


const Register = () => {
    const [show, setShow] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            role: "student"
        }
    })

    const googleSignIn = async () => {
        setIsLoading(true)
        try {
            const res = await signInWithPopup(auth, provider)
            let user = res.user
            let googleName = user.displayName
            let googleEmail = user.email
        
            const result = await axios.post(`${import.meta.env.VITE_SERVER_URI}/api/auth/google-auth-register`, {
                email: googleEmail,
                name: googleName,
                role: "student"
            }, {
                withCredentials: true
            })
            console.log(result)
            if (result?.data?.success) {
                toast.success("Google Sign In Success")
                dispatch(setUser(result.data.data))
                navigate('/')
            } else {
                toast.error(result?.data?.data?.message || "Failed to register with Google")
            }
        } catch (error) {
            console.log("Google Sign In Failed: ", error)
            toast.error("Google Sign In Failed")
        }
        setIsLoading(false)
    }

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true)
            const res = await axios.post(`${import.meta.env.VITE_SERVER_URI}/api/auth/register`, data, {
                withCredentials: true
            })
            if (res?.data?.success) {
                toast.success("Registeration Success")
                dispatch(setUser(res.data.data))
                navigate('/')
            } else {
                toast.error(res?.data?.data?.message || "Failed to register")
            }
            setIsLoading(false)
        } catch (error) {
            console.log("Registeration Failed: ", error)
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Invalid email or user already exists")
            } else {
                toast.error("Registeration Failed !!!")
            }
            setIsLoading(false)
        }
    }

    return (
        <div>
            <div className="w-fit p-2 sticky top-0 z-50">
                <Link to="/">
                    <div className="flex items-center space-x-2">
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
            </div>
            <div className="flex flex-col justify-center items-center h-[90vh]">
                <h2 className="text-2xl font-bold mb-6">Register</h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 shadow-lg p-8 py-6 rounded-lg w-[380px]">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <div className='relative'>
                                        <FormControl>
                                            <Input type={show ? 'text' : 'password'} placeholder="Enter your password" {...field} />
                                        </FormControl>
                                        <Button type="button" variant="ghost" onClick={() => setShow(!show)} className="w-9 h-9 absolute top-1/2 right-0 transform -translate-y-1/2 cursor-pointer">
                                            {show ? <IoEye /> : <IoEyeOff />}
                                        </Button>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <FormControl>
                                        <ToggleGroup
                                            type="single"
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            className="flex justify-center items-center gap-2"
                                        >
                                            <ToggleGroupItem className="data-[state=on]:bg-primary data-[state=on]:text-white w-24 rounded-lg border-1 cursor-pointer hover:bg-primary hover:text-white" value="student" aria-label="Toggle student">
                                                Student
                                            </ToggleGroupItem>
                                            <ToggleGroupItem className="data-[state=on]:bg-primary data-[state=on]:text-white w-24 rounded-lg border-1 cursor-pointer hover:bg-primary hover:text-white" value="educator" aria-label="Toggle educator">
                                                Educator
                                            </ToggleGroupItem>
                                        </ToggleGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isLoading} className='w-full cursor-pointer transtition-all hover:bg-white hover:text-black border-1 py-1 px-10 text-[1.01rem]'>{isLoading ? "Registering..." : "Register"}</Button>
                        <div className="flex gap-2 justify-center items-center">
                            <div className="flex-grow h-px bg-gray-300"></div>
                            <div className="text-gray-500">OR</div>
                            <div className="flex-grow h-px bg-gray-300"></div>
                        </div>
                        <Button
                            type="button"
                            className="cursor-pointer w-full transtition-all hover:bg-gray-600 py-1 px-10 text-[1.01rem]"
                            onClick={googleSignIn}
                            disabled={isLoading}
                        >
                            <img
                                src="https://www.svgrepo.com/show/475656/google-color.svg"
                                alt="Google Logo"
                                width={20}
                                height={20}
                            />
                            Continue with Google
                        </Button>
                        <p className="text-center mt-4">
                            Already have an account? <Link to="/login" className="text-primary font-bold">Login</Link>
                        </p>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default Register