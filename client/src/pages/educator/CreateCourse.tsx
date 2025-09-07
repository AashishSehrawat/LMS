
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import { triggerPublicCourseRefresh } from "@/redux/reducer/course.reducer"
import { useDispatch } from "react-redux"

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  category: z.enum([
    "",
    "App Development",
    "Web Development",
    "Data Science",
    "Machine Learning",
    "Artificial Intelligence",
    "Ethical Hacking",
    "Cyber Security",
    "UI UX Design",
    "Others",
  ])
})

const CreateCourse = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    console.log("dara", data)
    try {
      const res = await axios.post(`${import.meta.env.VITE_SERVER_URI}/api/course/create`, data, {
        withCredentials: true
      })
      if (res?.data?.success) {
        dispatch(triggerPublicCourseRefresh())
        toast.success("Course created successfully")
        navigate("/dashboard/courses")
      } else {
        toast.error(res?.data?.data?.message || "Failed to create course")
      }
    } catch (error) {
      console.log("Error in onSubmit", error)
      toast.error("Failed to create course")
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="space-y-8 h-[90vh]">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="hover:bg-muted cursor-pointer transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Create Course</h1>
        </div>

        {/* Form */}
        <div className="flex justify-center items-center h-[80vh]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-[400px] h-fit space-y-8 p-6 shadow-lg rounded-lg">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Title of course" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select value={field.value}
                        onValueChange={field.onChange}
                        disabled={isLoading}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="App Development">App Development</SelectItem>
                          <SelectItem value="Web Development">Web Development</SelectItem>
                          <SelectItem value="Data Science">Data Science</SelectItem>
                          <SelectItem value="Machine Learning">Machine Learning</SelectItem>
                          <SelectItem value="Artificial Intelligence">Artificial Intelligence</SelectItem>
                          <SelectItem value="Ethical Hacking">Ethical Hacking</SelectItem>
                          <SelectItem value="Cyber Security">Cyber Security</SelectItem>
                          <SelectItem value="UI UX Design">UI UX Design</SelectItem>
                          <SelectItem value="Others">Others</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full cursor-pointer transtition-all hover:bg-white hover:text-black border-1 py-1 px-10 text-[1.01rem] ">
                {isLoading ? "Creating..." : "Create"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default CreateCourse