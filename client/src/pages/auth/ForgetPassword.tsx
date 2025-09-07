import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from "zod"
import axios from 'axios'
import { useState } from 'react'
import { toast } from 'sonner'

const formSchema = z.object({
    email: z.email({ message: "Please enter a valid email address." }),
})

const ForgetPassword = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const navigate = useNavigate()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        }
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true)
        try {
            const res = await axios.post(`${import.meta.env.VITE_SERVER_URI}/api/auth/send-otp`, data, {
                withCredentials: true
            })
            if (res?.data?.success) {
                toast.success("OTP sent successfully")
                navigate("/otp/verify", {
                    state: {
                        email: data.email
                    }
                })
            } else {
                toast.error(res?.data?.data?.message || "Failed to send OTP")
            }           
        } catch (error) {
            console.log("Error in onSubmit", error)
            toast.error("Email is incorrect")
        }
        setIsLoading(false)
    }
    return (
        <div>
            <div className="flex flex-col justify-center items-center h-[90vh]">
                <h2 className="text-2xl font-bold mb-6">Forget Password</h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 shadow-lg p-10 rounded-lg w-[350px]">
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
                        <Button type="submit" disabled={isLoading} className='w-full cursor-pointer transtition-all hover:bg-white hover:text-black border-1 py-1 px-10 text-[1.01rem]'>Send OTP</Button>
                        <p className='text-center'>Back to <Link to="/login" className="text-primary font-bold">Login</Link></p>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default ForgetPassword