import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, Save, Trash2, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { triggerPublicCourseRefresh } from "@/redux/reducer/course.reducer";
import { useDispatch } from "react-redux";

const courseSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title too long"),
    subTitle: z.string().min(1, "Subtitle is required").max(200, "Subtitle too long"),
    description: z.string().min(10, "Description must be at least 10 characters"),
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
    ]),
    level: z.enum([
        "",
        "Beginner",
        "Intermediate",
        "Advanced",
    ]),
    price: z.number().min(0, "Price must be positive"),
    thumbnail: z.union([z.string(), z.instanceof(File), z.any()]),
    isPublished: z.boolean().optional(),
});

type CourseFormData = z.infer<typeof courseSchema>;

const categories = [
    "App Development",
    "Web Development",
    "Data Science",
    "Machine Learning",
    "Artificial Intelligence",
    "Ethical Hacking",
    "Cyber Security",
    "UI UX Design",
    "Others",
];

const courseLevels = [
    "Beginner",
    "Intermediate",
    "Advanced",
];

export default function EditCourse() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [saved, setSaved] = useState<boolean>(false)
    const { id } = useParams();
    const dispatch = useDispatch()

    const getCourseById = async (id: string) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_SERVER_URI}/api/course/course/${id}`,
                { withCredentials: true }
            )
            console.log("Course by id", res?.data)
            if (res?.data?.success) {
                form.setValue("title", res?.data?.data?.title);
                form.setValue("subTitle", res?.data?.data?.subTitle);
                form.setValue("description", res?.data?.data?.description);
                form.setValue("category", res?.data?.data?.category);
                form.setValue("level", res?.data?.data?.level);
                form.setValue("price", res?.data?.data?.price);
                form.setValue("thumbnail", res?.data?.data?.thumbnail);
                form.setValue("isPublished", res?.data?.data?.isPublished);
            }
        } catch (error) {
            console.log("Error in getCourseById", error)
        }
    }

    useEffect(() => {
        if (id) {
            getCourseById(id)
        }
    }, [id])

    const form = useForm<CourseFormData>({
        resolver: zodResolver(courseSchema),
        defaultValues: {
            title: "",
            subTitle: "",
            description: "",
            category: "",
            level: "",
            price: 0,
            thumbnail: "",
            isPublished: false,
        },
    });

    const onSave = async (data: CourseFormData) => {
        console.log("Saving course:", data);
        setIsLoading(true)
        try {
            const formdata = new FormData()
            formdata.append("title", data.title)
            formdata.append("subTitle", data.subTitle)
            formdata.append("description", data.description)
            formdata.append("category", data.category)
            formdata.append("level", data.level)
            formdata.append("price", data.price.toString())
            if (data.thumbnail instanceof File) {
                formdata.append("thumbnail", data.thumbnail);
            }
            const res = await axios.put(`${import.meta.env.VITE_SERVER_URI}/api/course/edit/${id}`, formdata, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            if (res?.data?.success) {
                setSaved(true)
                toast.success("Course saved successfully")
            } else {
                toast.error(res?.data?.data?.message || "Failed to save course")
            }
        } catch (error) {
            console.log("Error in onSave", error)
            toast.error("Failed to save course")
        }
        setIsLoading(false)
    };

    const onPublish = async () => {
        setIsLoading(true)
        if(!saved){
            toast.error("Please save the course first")
            setIsLoading(false)
            return
        }
        try {
            const res = await axios.put(`${import.meta.env.VITE_SERVER_URI}/api/course/edit/${id}`, {
                isPublished: true
            }, {
                withCredentials: true
            })
            if (res?.data?.success) {
                dispatch(triggerPublicCourseRefresh())
                toast.success("Course published successfully")
                navigate("/dashboard/courses")
            } else {
                toast.error(res?.data?.data?.message || "Failed to publish course")
            }
        } catch (error) {
            console.log("Error in onPublish", error)
            toast.error("Failed to publish course")
        }
        setIsLoading(false)
    };

    const onDelete = async () => {
        setIsLoading(true)
        try {
            const res = await axios.delete(`${import.meta.env.VITE_SERVER_URI}/api/course/delete/${id}`, {
                withCredentials: true
            })
            if (res?.data?.success) {
                dispatch(triggerPublicCourseRefresh())
                toast.success("Course deleted successfully")
                navigate("/dashboard/courses")
            } else {
                toast.error(res?.data?.data?.message || "Failed to delete course")
            }
        } catch (error) {
            console.log("Error in onDelete", error)
            toast.error("Failed to delete course")
        }
        setIsLoading(false)
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setValue("thumbnail", file as any);
        }
    };

    const onCancel = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => navigate(-1)}
                            className="hover:bg-muted cursor-pointer transition-all duration-300"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold">Edit Course</h1>
                            <p className="text-muted-foreground">
                                Update your course information and content
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={() => navigate(`/dashboard/create-lecture/${id}`)}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                    >
                        Go to Lecture Page
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Course Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
                                        {/* Title */}
                                        <FormField
                                            control={form.control}
                                            name="title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Course Title *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Enter course title..."
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Subtitle */}
                                        <FormField
                                            control={form.control}
                                            name="subTitle"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Subtitle *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Enter course subtitle..."
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Description */}
                                        <FormField
                                            control={form.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Course Description *</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Describe what students will learn in this course..."
                                                            className="min-h-[120px] resize-none"
                                                            {...field}
                                                        />
                                                    </FormControl>

                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Category and Course Level */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="category"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Category *</FormLabel>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select category" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {categories.map((category) => (
                                                                    <SelectItem key={category} value={category}>
                                                                        {category}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="level"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Course Level *</FormLabel>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select level" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {courseLevels.map((level) => (
                                                                    <SelectItem key={level} value={level}>
                                                                        {level}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        {/* Price */}
                                        <FormField
                                            control={form.control}
                                            name="price"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Price (inr) *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            placeholder="0"
                                                            value={field.value}
                                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>

                        {/* Thumbnail Upload */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Course Thumbnail *</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                                    {
                                        form.watch("thumbnail") ? (
                                            <img
                                                src={
                                                    form.watch("thumbnail") instanceof File ?
                                                        URL.createObjectURL(form.watch("thumbnail"))
                                                        :
                                                        form.watch("thumbnail")
                                                }
                                                alt="Course Thumbnail"
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                        ) : (
                                            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                        )
                                    }
                                    <h3 className="text-lg font-medium mb-2">Upload Thumbnail</h3>
                                    <p className="text-muted-foreground mb-4">
                                        Choose an image that represents your course (recommended: 1280x720)
                                    </p>
                                    <Label
                                        htmlFor="thumbnail"
                                        className="text-center"
                                    >
                                        <div className="flex items-center mx-auto gap-2 px-4 py-2 rounded-md border cursor-pointer hover:bg-muted">
                                            <Upload className="h-4 w-4" />
                                            Choose File
                                        </div>
                                    </Label>
                                    <Input
                                        id="thumbnail"
                                        type="file"
                                        onChange={handleThumbnailChange}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar Actions */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button
                                    onClick={form.handleSubmit(onSave)}
                                    className="w-full gap-2"
                                    disabled={isLoading}
                                >
                                    <Save className="h-4 w-4" />
                                    Save Changes
                                </Button>

                                <Button
                                    onClick={onPublish}
                                    variant="outline"
                                    className="w-full gap-2 text-black bg-success hover:bg-success/90"
                                    disabled={isLoading}
                                >
                                    <Eye className="h-4 w-4" />
                                    Publish Course
                                </Button>

                                <div className="border-t pt-4">
                                    <Button
                                        onClick={onCancel}
                                        variant="outline"
                                        className="w-full mb-2"
                                        disabled={isLoading}
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        onClick={onDelete}
                                        variant="destructive"
                                        className="w-full gap-2"
                                        disabled={isLoading}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Delete Course
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Course Status */}
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle className="text-lg">Course Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Status:</span>
                                        <span className="text-sm font-medium">{
                                            form.watch("isPublished") ? "Published" : "Draft"
                                        }</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Visibility:</span>
                                        <span className="text-sm">{
                                            form.watch("isPublished") ? "Public" : "Private"
                                        }</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
