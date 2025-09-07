import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useState } from "react"
import Countdown from "react-countdown"
import { useForm } from "react-hook-form"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { z } from "zod"

const formSchema = z.object({
    otp: z.string().regex(/^\d+$/, "OTP must contain only numbers").min(6, "OTP must be at least 6 characters."),
})

const OtpVerification = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [correctOtp, setCorrectOtp] = useState<boolean>(false)
    const [expiry, setExpiry] = useState(Date.now() + 30 * 1000); // 30 seconds
    const navigate = useNavigate()
    const location = useLocation()
    const { email } = location.state

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            otp: "",
        }
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true)
            const res = await axios.post(`${import.meta.env.VITE_SERVER_URI}/api/auth/verify-otp`, {
                email,
                otp: data.otp
            }, { withCredentials: true })
            if (res?.data?.success) {
                setCorrectOtp(true)
                navigate("/password/update", {
                    state: {
                        email
                    }
                })
            } else {
                setCorrectOtp(false)
                toast.error(res?.data?.data?.message || "Failed to verify OTP")
            }
        } catch (error) {
            setCorrectOtp(false)
            console.log("Error in onSubmit", error)
            toast.error("OTP is incorrect")
        }
        setIsLoading(false)
    }

    const onResendOtp = async () => {
        try {
            setIsLoading(true)
            setCorrectOtp(false)
            const res = await axios.post(`${import.meta.env.VITE_SERVER_URI}/api/auth/send-otp`, {
                email
            }, { withCredentials: true })
            if (res?.data?.success) {
                toast.success("OTP sent successfully")
                setExpiry(Date.now() + 30 * 1000)
            } else {
                toast.error(res?.data?.data?.message || "Failed to send OTP")
            }
        } catch (error) {
            console.log("Error in onResendOtp", error)
            toast.error("Failed to send OTP")
            setCorrectOtp(false)
        }
        setIsLoading(false)
    }

    return (
        <div>
            <div className="flex flex-col justify-center items-center h-[90vh]">
                <h2 className="text-2xl font-bold mb-6">OTP Verification</h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 shadow-lg p-10 rounded-lg w-[350px]">
                        <FormField
                            control={form.control}
                            name="otp"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>OTP</FormLabel>
                                    <FormControl>
                                        <InputOTP maxLength={6} value={field.value} onChange={field.onChange}>
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                                <InputOTPSlot index={2} />
                                            </InputOTPGroup>
                                            <InputOTPSeparator />
                                            <InputOTPGroup>
                                                <InputOTPSlot index={3} />
                                                <InputOTPSlot index={4} />
                                                <InputOTPSlot index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isLoading || !form.formState.isValid} className='w-full cursor-pointer transtition-all hover:bg-white hover:text-black border-1 py-1 px-10 text-[1.01rem]'>Verify</Button>
                        <Countdown 
                            key={expiry}
                            date={expiry}
                            renderer={({ minutes, seconds, completed }) => {
                                if (completed) {
                                    return <Button variant="ghost" disabled={isLoading} onClick={onResendOtp} className="cursor-pointer">Resend OTP</Button>
                                }
                                return (
                                    <span>
                                        0{minutes}:
                                        {seconds < 10 ? `0${seconds}` : seconds}
                                    </span>
                                )
                            }}
                        />
                        <p className='text-center'>Back to <Link to="/login" className="text-primary font-bold">Login</Link></p>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default OtpVerification