import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { ArrowLeft, Mic, Search } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import start from "../assets/search.wav"

const SearchWithAI = () => {
    const startSound = new Audio(start)
    const navigate = useNavigate()
    const [input, setInput] = useState<string>("")
    const [recommedation, setRecommadation] = useState<string[]>([])

    const speak = (message: string) => {
        const utterance = new SpeechSynthesisUtterance(message)
        speechSynthesis.speak(utterance)
    }

    const speechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const speechRecognitionInstance: any = new speechRecognition()

    if (!speechRecognitionInstance) {
        toast.error("Speech recogination not supported")
    }

    const handleSearch = async () => {
        if (!speechRecognitionInstance) return;
        speechRecognitionInstance.start()
        startSound.play()
        speechRecognitionInstance.onresult = async (e: any) => {
            const transcript = e.results[0][0].transcript.trim()
            setInput(transcript)
            await handleRecommadation(transcript)
        }
    }

    const handleRecommadation = async (query: string) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URI}/api/course/search`,
                { query },
                { withCredentials: true }
            )
            // console.log("response in search", response)
            if (response.data.success) {
                if(response.data.data.length === 0) {
                    speak("No courses found")
                } else {
                    speak("These are top courses i found for you")
                }
                setRecommadation(response.data.data)
            } 
        } catch (error) {
            console.log("Error in search", error)
        }
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto p-8">
                <div className="flex items-center gap-4 lg:mb-12 md:mb-8 mb-4">
                    <Button variant="outline" className="cursor-pointer" onClick={() => navigate(-1)}>
                        <ArrowLeft />
                    </Button>
                    <h1 className="text-4xl ">Search Courses</h1>
                </div>

                <form className="max-w-5xl mx-auto flex flex-col items-center">
                    <h2 className="text-3xl mb-2 flex items-center gap-3">
                        <Search className="text-purple-600" />
                        <p>Search with <span className="text-purple-600">AI</span></p>
                    </h2>
                    <div className="relative w-full">
                        <Input
                            placeholder="What do you want to learn? (e.g. AI, MERN, ... )"
                            className="rounded-full p-6 text-[30px]"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <Button
                            onClick={() => handleRecommadation(input)}
                            type="button"
                            className="absolute right-14 rounded-full hover:bg-gray-200 top-1/2 -translate-y-1/2 text-gray-400">
                            <Search />
                        </Button>
                        <Button
                            onClick={handleSearch}
                            type="button"
                            className="absolute right-2 rounded-full hover:bg-gray-200 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
                            <Mic />
                        </Button>
                    </div>
                </form>
                { 
                    recommedation.length > 0 ? (
                        <div className="mt-12">
                            <h2 className="text-3xl mb-2 flex items-center gap-3">
                                Recommended Courses
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
                                {recommedation.map((course: any) => (
                                    <Link to={`/course/${course._id}`} className="hover:shadow-lg transition-shadow" key={course._id}>
                                        <Card>
                                            <CardHeader>
                                                <img src={course.thumbnail} alt="" className="w-full h-48 object-cover overflow-hidden rounded-lg" />
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-lg font-semibold">{course.title}</h3>
                                                    <span className="text-xs text-muted-foreground bg-primary/10 px-2 py-1 rounded-full">{course.category}</span>
                                                </div>
                                                <p className="text-sm text-gray-500">{course.description}</p>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full mt-24">
                            <p className="text-2xl text-gray-400">No courses found</p>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default SearchWithAI