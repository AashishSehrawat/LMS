import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { IoEye, IoEyeOff } from 'react-icons/io5'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { z } from "zod"
import axios from "axios"
import { toast } from "sonner"

const formSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters."),
})

const UpdatePassword = () => {
    const [show, setShow] = useState<boolean>(false)    
    const [isLoading, setIsLoading] = useState<boolean>(false)    
    const location = useLocation()
    const navigate = useNavigate()
    const { email } = location.state

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        }
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true)
            if (data.password !== data.confirmPassword) {
                toast.error("Passwords do not match")
                setIsLoading(false)
                return
            }
            const res = await axios.post(`${import.meta.env.VITE_SERVER_URI}/api/auth/reset-password`, {
                email,
                password: data.password
            }, { withCredentials: true })
            if (res?.data?.success) {
                navigate("/login")
            } else {
                toast.error(res?.data?.data?.message || "Failed to reset password")
            }
        } catch (error) {
            console.log("Error in onSubmit", error)
            toast.error("Failed to reset password")
        }
        setIsLoading(false)
    }
    return (
        <div>
            <div className="flex flex-col justify-center items-center h-[90vh]">
                <h2 className="text-2xl font-bold mb-6">Update Password</h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 shadow-lg p-10 rounded-lg w-[350px]">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
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
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <div className='relative'>
                                        <FormControl>
                                            <Input type={show ? 'text' : 'password'} placeholder="Confirm new password" {...field} />
                                        </FormControl>
                                        <Button type="button" variant="ghost" onClick={() => setShow(!show)} className="w-9 h-9 absolute top-1/2 right-0 transform -translate-y-1/2 cursor-pointer">
                                            {show ? <IoEye /> : <IoEyeOff />}
                                        </Button>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isLoading} className='w-full cursor-pointer transtition-all hover:bg-white hover:text-black border-1 py-1 px-10 text-[1.01rem]'>Update Password</Button>
                        <p className='text-center'>Back to <Link to="/login" className="text-primary font-bold">Login</Link></p>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default UpdatePassword