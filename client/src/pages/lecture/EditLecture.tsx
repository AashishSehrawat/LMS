import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { setLectures } from "@/redux/reducer/lecture.reducer"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { ArrowLeft, Trash } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import z from "zod"

const formSchema = z.object({
    lectureTitle: z.string().min(3, "Lecture title must be at least 3 characters long"),
    isPreviewFree: z.boolean(),
    videoUrl: z.union([z.string(), z.instanceof(File), z.any()]),
})

const EditLecture = () => {
    const { lectureId } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { lectures } = useSelector((state: any) => state.lectures)

    const getLectureById = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_SERVER_URI}/api/lecture/get/${lectureId}`, {
                withCredentials: true
            })
            if (res?.data?.success) {
                form.setValue("lectureTitle", res?.data?.data?.lectureTitle);
                form.setValue("isPreviewFree", res?.data?.data?.isPreviewFree);
                form.setValue("videoUrl", res?.data?.data?.videoUrl);
            } else {
                toast.error(res?.data?.data?.message || "Failed to get lecture")
            }
        } catch (error) {
            console.log("Error in getLectureById", error)
            toast.error("Failed to get lecture")
        }
    }

    useEffect(() => {
        getLectureById()
    }, [lectureId])

    const handleRemoveLecture = async () => {
        try {
            const res = await axios.delete(`${import.meta.env.VITE_SERVER_URI}/api/lecture/delete/${lectureId}`, {
                withCredentials: true
            })
            if (res?.data?.success) {
                toast.success("Lecture deleted successfully")
                navigate(-1)
            } else {
                toast.error(res?.data?.data?.message || "Failed to delete lecture")
            }
        } catch (error) {
            console.log("Error in handleRemoveLecture", error)
            toast.error("Failed to delete lecture")
        }
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            lectureTitle: "",
            isPreviewFree: false,
            videoUrl: "",
        }
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        console.log(data)
        setIsLoading(true)
        console.log("data", data.isPreviewFree)
        try {
            const formdata = new FormData()
            formdata.append("lectureTitle", data.lectureTitle)
            formdata.append("isPreviewFree", data.isPreviewFree.toString())
            if (data.videoUrl instanceof File) {
                formdata.append("videoUrl", data.videoUrl);
            }
            const res = await axios.put(`${import.meta.env.VITE_SERVER_URI}/api/lecture/edit/${lectureId}`, formdata, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            if (res?.data?.success) {
                toast.success("Lecture updated successfully")
                dispatch(setLectures(
                    lectures.map((lec: any) =>
                        lec._id === res?.data?.data._id ? res?.data?.data : lec
                      )
                ))
                navigate(-1)
            } else {
                toast.error(res?.data?.data?.message || "Failed to update lecture")
            }
        } catch (error) {
            console.log("Error in onSubmit", error)
            toast.error("Failed to update lecture")
        }
        setIsLoading(false)
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="flex items-center gap-4 mb-8">
                    <Button
                        className="mr-4"
                        variant="outline"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft className="h-4 w-4" />Back to Courses
                    </Button>
                    <h1 className="text-4xl font-semibold">Let's Edit a Lecture</h1>
                </div>
                <Button
                    className="mr-4 text-white bg-red-500 hover:bg-red-600 focus-visible:ring-red-600 cursor-pointer mb-4"
                    onClick={() => handleRemoveLecture()}
                >
                    <Trash className="h-4 w-4" />Remove Lecture
                </Button>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="lectureTitle"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Lecture Title *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your lecture title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="videoUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Video *</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="file"
                                            accept="video/*"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    field.onChange(e.target.files[0]); // pass File object to RHF
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isPreviewFree"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Is this lecture free?</FormLabel>
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isLoading} className="w-full cursor-pointer hover:bg-primary/90">{isLoading ? "Updating..." : "Update Lecture"}</Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default EditLecture