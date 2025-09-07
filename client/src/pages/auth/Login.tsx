import educationLogo from "@/assets/logo.jpg"
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import { auth, provider } from "@/lib/firebase"
import { setUser } from '@/redux/reducer/auth.reducer'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from "axios"
import { signInWithPopup } from "firebase/auth"
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { IoEye, IoEyeOff } from "react-icons/io5"
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
  email: z.email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, "Password must be at least 6 characters."),
})

function Login() {
  const [show, setShow] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    try {
      const res = await axios.post(`${import.meta.env.VITE_SERVER_URI}/api/auth/login`, data, {
        withCredentials: true
      })
      console.log("Login Success: ", res);
      if (res?.data?.success) {
        toast.success("Login Successfully")
        dispatch(setUser(res.data.data))
        navigate('/')
      } else {
        toast.error(res?.data?.data?.message || "Failed to login")
      }
    } catch (error) {
      console.log("Error in onSubmit", error)
      toast.error("Email or password is incorrect")
    }
    setIsLoading(false)
  }

  const loginWthGoogle = async () => {
    setIsLoading(true)
    try {
      const res = await signInWithPopup(auth, provider)
      let user = res.user
      let googleEmail = user.email

      const result = await axios.post(`${import.meta.env.VITE_SERVER_URI}/api/auth/google-auth-login`, {
        email: googleEmail
      }, {
        withCredentials: true
      })
 
      if (result?.data?.success) {
        toast.success("Google Sign In Success")
        dispatch(setUser(result.data.data))
        navigate('/')
      } else {
        toast.error(result?.data?.data?.message || "Failed to login")
      }
    } catch (error) {
      console.log("Error in onSubmit", error)
      toast.error("Google Login Failed")
    }
    setIsLoading(false)
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
      <div className="flex justify-center flex-col items-center h-[90vh]">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        <div className="flex flex-col gap-6 shadow-lg p-10 rounded-lg w-[350px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type='text' placeholder="Enter your email" {...field} />
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
              <Button type="submit" disabled={isLoading} className='w-full cursor-pointer transtition-all hover:bg-white hover:text-black border-1 py-1 px-10 text-[1.01rem]'>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
              <div className="flex gap-2 justify-center items-center">
                <div className="flex-grow h-px bg-gray-300"></div>
                <div className="text-gray-500">OR</div>
                <div className="flex-grow h-px bg-gray-300"></div>
              </div>
              <Button
                type="button"
                disabled={isLoading}
                className="cursor-pointer transtition-all hover:bg-gray-600 py-1 px-10 text-[1.01rem]"
                onClick={loginWthGoogle}
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google Logo"
                  width={20}
                  height={20}
                />
                Continue with Google
              </Button>
              <Link to="/password/forget">
                <Button variant="ghost" className="w-full cursor-pointer text-red-500 hover:text-red-600 py-1 px-10 text-[1.01rem]" onClick={() => navigate('/password/forget')}>Forget Password?</Button>
              </Link>
              <p className="text-center mt-4">
                Don't have an account? <Link to="/register" className="text-primary font-bold">Register</Link>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default Login