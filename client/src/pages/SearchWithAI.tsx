import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { ArrowLeft, Loader2, Mic, Search } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import start from "../assets/search.wav"

const SearchWithAI = () => {
    const startSound = new Audio(start)
    const navigate = useNavigate()
    const [input, setInput] = useState<string>("")
    const [recommedation, setRecommadation] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [hasSearched, setHasSearched] = useState<boolean>(false)

    const speak = (message: string) => {
        const utterance = new SpeechSynthesisUtterance(message)
        speechSynthesis.speak(utterance)
    }

    const handleSearch = async () => {
        // Instantiate SpeechRecognition inside the handler to avoid crashing the
        // component on unsupported browsers (was previously called at top-level)
        const SpeechRecognitionAPI =
            (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

        if (!SpeechRecognitionAPI) {
            toast.error("Speech recognition is not supported in this browser")
            return
        }

        const instance = new SpeechRecognitionAPI()
        startSound.play()
        instance.start()
        instance.onresult = async (e: any) => {
            const transcript = e.results[0][0].transcript.trim()
            setInput(transcript)
            await handleRecommadation(transcript)
        }
        instance.onerror = () => {
            toast.error("Speech recognition failed, please try again")
        }
    }

    const handleRecommadation = async (query: string) => {
        if (!query.trim()) {
            toast.error("Please enter a search query")
            return
        }
        setIsLoading(true)
        setHasSearched(true)
        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URI}/api/course/search`,
                { query: query.trim() },
                { withCredentials: true }
            )
            if (response.data.success) {
                if (response.data.data.length === 0) {
                    speak("No courses found")
                } else {
                    speak("These are top courses I found for you")
                }
                setRecommadation(response.data.data)
            }
        } catch (error: any) {
            const msg = error?.response?.data?.message || "Search failed, please try again"
            console.log("Error in search", error)
            toast.error(msg)
        } finally {
            setIsLoading(false)
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

                <form className="max-w-5xl mx-auto flex flex-col items-center" onSubmit={(e) => { e.preventDefault(); handleRecommadation(input) }}>
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
                            disabled={isLoading}
                            className="absolute right-14 rounded-full hover:bg-gray-200 top-1/2 -translate-y-1/2 text-gray-400">
                            {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
                        </Button>
                        <Button
                            onClick={handleSearch}
                            type="button"
                            disabled={isLoading}
                            className="absolute right-2 rounded-full hover:bg-gray-200 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
                            <Mic />
                        </Button>
                    </div>
                </form>
                {isLoading ? (
                    <div className="flex items-center justify-center h-full mt-24">
                        <Loader2 className="animate-spin w-8 h-8 text-purple-600" />
                        <p className="ml-3 text-xl text-gray-500">Searching with AI...</p>
                    </div>
                ) : recommedation.length > 0 ? (
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
                ) : hasSearched ? (
                    <div className="flex items-center justify-center h-full mt-24">
                        <p className="text-2xl text-gray-400">No courses found for your query</p>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full mt-24">
                        <p className="text-2xl text-gray-400">Type or speak to search for courses</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SearchWithAI