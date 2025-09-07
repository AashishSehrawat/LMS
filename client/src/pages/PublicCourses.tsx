import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { IndianRupee, Star } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { usePublicCourses } from "../hooks/usePublicCourses"

const PublicCourses = () => {
  const [category, setCategory] = useState<string[]>([])
  const publicCourses = usePublicCourses()

  const handleCategoryChange = (cat: string) => {
    setCategory(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  const filteredCourses = publicCourses?.filter((c: any) => {
    if (category.length > 0) {
      return category.includes(c.category)
    }
    return true
  })

  return (

    <div>
      <Header />
      <div className="w-full flex">
        {/* desktop view */}
        <div className="p-4 flex-shrink-0 w-[250px] bg-gray-100 h-[calc(100vh-66px)] overflow-y-auto hidden md:block">
          <p className="text-xl font-semibold mb-4">Filter by Category</p>
          <form>
            <Link to="/search">
              <Button variant="outline" className="w-full mb-2 cursor-pointer">
                Search with AI
              </Button>
            </Link>

            <div className="flex items-center gap-3 mb-2">
              <Checkbox
                id="webDevelopment"
                className="w-5 h-5 border-gray-400"
                checked={category.includes("Web Development")}
                onCheckedChange={() => handleCategoryChange("Web Development")}
              />
              <Label htmlFor="webDevelopment">Web Development</Label>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <Checkbox id="appDevelopment"
                className="w-5 h-5 border-gray-400"
                checked={category.includes("App Development")}
                onCheckedChange={() => handleCategoryChange("App Development")} />
              <Label htmlFor="appDevelopment">App Development</Label>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <Checkbox id="dataScience"
                className="w-5 h-5 border-gray-400"
                checked={category.includes("Data Science")}
                onCheckedChange={() => handleCategoryChange("Data Science")} />
              <Label htmlFor="dataScience">Data Science</Label>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <Checkbox id="machineLearning"
                className="w-5 h-5 border-gray-400"
                checked={category.includes("Machine Learning")}
                onCheckedChange={() => handleCategoryChange("Machine Learning")} />
              <Label htmlFor="machineLearning">Machine Learning</Label>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <Checkbox id="artificialIntelligence"
                className="w-5 h-5 border-gray-400"
                checked={category.includes("Artificial Intelligence")}
                onCheckedChange={() => handleCategoryChange("Artificial Intelligence")} />
              <Label htmlFor="artificialIntelligence">Artificial Intelligence</Label>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <Checkbox id="cybersecurity"
                className="w-5 h-5 border-gray-400"
                checked={category.includes("Cybersecurity")}
                onCheckedChange={() => handleCategoryChange("Cybersecurity")} />
              <Label htmlFor="cybersecurity">Cybersecurity</Label>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <Checkbox id="ethicalHacking"
                className="w-5 h-5 border-gray-400"
                checked={category.includes("Ethical Hacking")}
                onCheckedChange={() => handleCategoryChange("Ethical Hacking")} />
              <Label htmlFor="ethicalHacking">Ethical Hacking</Label>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <Checkbox id="uiUXDesign"
                className="w-5 h-5 border-gray-400"
                checked={category.includes("UI UX Design")}
                onCheckedChange={() => handleCategoryChange("UI UX Design")} />
              <Label htmlFor="uiUXDesign">UI UX Design</Label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox id="others"
                className="w-5 h-5 border-gray-400"
                checked={category.includes("Others")}
                onCheckedChange={() => handleCategoryChange("Others")} />
              <Label htmlFor="others">Others</Label>
            </div>
          </form>
        </div>

        {/* mobile view */}
        <div className="md:hidden fixed bottom-4 right-4 z-50">
          <Popover>
            <PopoverTrigger asChild>
              <Button>Filter</Button>
            </PopoverTrigger>
            <PopoverContent>
              <form>
              <Link to="/search">
              <Button variant="outline" className="w-full mb-2 cursor-pointer">
                Search with AI
              </Button>
            </Link>
                <div className="flex items-center gap-3 mb-2">
                  <Checkbox
                    id="webDevelopment"
                    className="w-5 h-5 border-gray-400"
                    checked={category.includes("Web Development")}
                    onCheckedChange={() => handleCategoryChange("Web Development")}
                  />
                  <Label htmlFor="webDevelopment">Web Development</Label>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <Checkbox id="appDevelopment"
                    className="w-5 h-5 border-gray-400"
                    checked={category.includes("App Development")}
                    onCheckedChange={() => handleCategoryChange("App Development")} />
                  <Label htmlFor="appDevelopment">App Development</Label>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <Checkbox id="dataScience"
                    className="w-5 h-5 border-gray-400"
                    checked={category.includes("Data Science")}
                    onCheckedChange={() => handleCategoryChange("Data Science")} />
                  <Label htmlFor="dataScience">Data Science</Label>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <Checkbox id="machineLearning"
                    className="w-5 h-5 border-gray-400"
                    checked={category.includes("Machine Learning")}
                    onCheckedChange={() => handleCategoryChange("Machine Learning")} />
                  <Label htmlFor="machineLearning">Machine Learning</Label>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <Checkbox id="artificialIntelligence"
                    className="w-5 h-5 border-gray-400"
                    checked={category.includes("Artificial Intelligence")}
                    onCheckedChange={() => handleCategoryChange("Artificial Intelligence")} />
                  <Label htmlFor="artificialIntelligence">Artificial Intelligence</Label>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <Checkbox id="cybersecurity"
                    className="w-5 h-5 border-gray-400"
                    checked={category.includes("Cybersecurity")}
                    onCheckedChange={() => handleCategoryChange("Cybersecurity")} />
                  <Label htmlFor="cybersecurity">Cybersecurity</Label>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <Checkbox id="ethicalHacking"
                    className="w-5 h-5 border-gray-400"
                    checked={category.includes("Ethical Hacking")}
                    onCheckedChange={() => handleCategoryChange("Ethical Hacking")} />
                  <Label htmlFor="ethicalHacking">Ethical Hacking</Label>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <Checkbox id="uiUXDesign"
                    className="w-5 h-5 border-gray-400"
                    checked={category.includes("UI UX Design")}
                    onCheckedChange={() => handleCategoryChange("UI UX Design")} />
                  <Label htmlFor="uiUXDesign">UI UX Design</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox id="others"
                    className="w-5 h-5 border-gray-400"
                    checked={category.includes("Others")}
                    onCheckedChange={() => handleCategoryChange("Others")} />
                  <Label htmlFor="others">Others</Label>
                </div>
              </form>
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 p-8 w-auto">
          {filteredCourses?.map((course: any) => (
            <Link key={course._id} to={`/course/${course._id}`}>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <img className="w-full h-48 object-cover overflow-hidden rounded-lg" src={course.thumbnail} alt="" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{course.title}</h3>
                    <span className="text-xs text-muted-foreground bg-primary/10 px-2 py-1 rounded-full">{course.category}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 h-16">{course.description.length > 100 ? course.description.slice(0, 100) + "..." : course.description}</p>
                  <div className="flex items-center gap-2 justify-between">
                    <p className="text-muted-foreground mt-2 flex items-center">
                      <IndianRupee />
                      <span className="text-[24px]">{course.price}</span>
                    </p>
                    <div className="flex items-center gap-2">
                      <Star className="text-yellow-300 fill-yellow-300" size={16} />
                      <span className="text-[16px] text-muted-foreground">{
                        course.reviews.length === 0 ? "0.0" : (course.reviews.reduce((acc: any, review: any) => acc + review.rating, 0) / course.reviews.length).toFixed(1)
                      }</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PublicCourses