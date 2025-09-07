import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Camera, Save } from "lucide-react";
import type { RootState } from "@/redux/store";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { setUser } from "@/redux/reducer/auth.reducer";

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Invalid email").readonly(),
    description: z.string().max(500, "Description must be less than 500 characters").optional(),
    photo: z.any().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const EditProfile = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch()
    const [preview, setPreview] = useState<string>(user?.photoUrl || "")

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.name || "",
            email: user?.email || "",
            description: user?.description || "",
            photo: user?.photoUrl || "",
        },
    });

    const description = watch("description");

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setValue("photo", file as any)

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data: ProfileFormData) => {
        setIsLoading(true)
        console.log("Form submitted:", data);
        try {
            const formData = new FormData()
            formData.append("name", data.name || "")
            formData.append("description", data.description || "")
            if(data.photo) formData.append("photoUrl", data.photo)

            const res = await axios.put(`${import.meta.env.VITE_SERVER_URI}/api/user/updateProfile`, formData, {
                withCredentials: true
            })
            if (res?.data?.success) {
                toast.success("Profile updated successfully")
                dispatch(setUser(res.data.data))
                navigate("/profile")
            } else {
                toast.error(res?.data?.data?.message || "Failed to update profile")
            }
        } catch (error) {
            console.log("Error updating profile:", error)
            toast.error("Failed to update profile")
        }
        setIsLoading(false)
    };

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-2xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigate("/profile")}
                        className="hover:bg-muted cursor-pointer transition-all duration-300"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-3xl font-bold text-foreground">Edit Profile</h1>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Card className="border-0 shadow-elegant">
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold">Profile Information</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {/* Photo Upload */}
                            <div className="flex flex-col items-center gap-4">
                                <div className="relative">
                                    <Avatar className="w-24 h-24 border-4 border-primary/10">
                                        <AvatarImage src={preview || watch("photo")} alt={watch("name")} />
                                        <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <label
                                        htmlFor="photo-upload"
                                        className="absolute -bottom-2 -right-2 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-colors shadow-lg"
                                    >
                                        <Camera className="h-4 w-4" />
                                    </label>
                                </div>
                                <input
                                    id="photo-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    className="hidden"
                                />
                                <p className="text-sm text-muted-foreground text-center">
                                    Click the camera icon to update your profile photo
                                </p>
                            </div>

                            {/* Name Field */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium">
                                    Full Name
                                </Label>
                                <Input
                                    id="name"
                                    {...register("name")}
                                    className="focus:ring-primary/20"
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500">{errors.name.message}</p>
                                )}
                            </div>

                            {/* Email Field (Read-only) */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    {...register("email")}
                                    disabled
                                    className="bg-muted text-muted-foreground cursor-not-allowed"
                                />
                                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                            </div>

                            {/* Bio Field */}
                            <div className="space-y-2">
                                <Label htmlFor="bio" className="text-sm font-medium">
                                    Bio
                                </Label>
                                <Textarea
                                    id="bio"
                                    {...register("description")}
                                    className="min-h-[100px] resize-none focus:ring-primary/20"
                                    placeholder="Tell us a bit about yourself..."
                                />
                                <p className="text-xs text-muted-foreground">
                                    {description?.length || 0}/500 characters
                                </p>
                                {errors.description && (
                                    <p className="text-sm text-red-500">{errors.description.message}</p>
                                )}
                            </div>

                            {/* Save Button */}
                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 hover:shadow-glow transition-all duration-300 cursor-pointer"
                                >
                                    <Save className="mr-2 h-4 w-4" />
                                    {isLoading ? "Updating..." : "Update Profile"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
