import CoursesSection from '@/components/CoursesSection'
import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { scrollToSection } from '@/lib/utils'
import { ArrowRight, Award, BookOpen, CheckCircle, Clock, Star, Users } from 'lucide-react'
import { useEffect } from 'react'
import { FaSearch } from "react-icons/fa"
import { useLocation, useNavigate } from 'react-router-dom'

function Home() {
    const navigate = useNavigate()
    const location = useLocation()  

    useEffect(() => {
        if (location.state?.scrollTo) {
          const targetId = location.state.scrollTo
          const el =
            targetId === "about"
              ? "about"
              : targetId === "features"
              ? "features"
              : targetId === "home"
              ? "home"
              : null
    
          if (el) {
            scrollToSection(el)
          }
        }
      }, [location])

    return (
        <div>
            <Header />

            {/* main section */}
            <section id="home" className="bg-gradient-to-br from-background to-education-light py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                            Unlock Your Learning
                            <span className="text-primary block">Potential</span>
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                            Join thousands of learners worldwide and master new skills with our
                            comprehensive online courses designed by industry experts.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                            <Button size="lg" variant="default" className="text-lg px-8 cursor-pointer" onClick={() => navigate('/courses')}>
                                Browse Courses
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button size="lg" variant="outline" className="text-lg px-8 cursor-pointer flex items-center" onClick={() => navigate('/search')}>
                                Search with AI <FaSearch className="ml-1 h-5 w-5" />
                            </Button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                            <div className="flex flex-col items-center space-y-2">
                                <div className="bg-primary/10 p-4 rounded-full">
                                    <BookOpen className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-2xl font-bold text-foreground">500+</h3>
                                <p className="text-muted-foreground">Expert Courses</p>
                            </div>
                            <div className="flex flex-col items-center space-y-2">
                                <div className="bg-accent/10 p-4 rounded-full">
                                    <Users className="h-8 w-8 text-accent" />
                                </div>
                                <h3 className="text-2xl font-bold text-foreground">50K+</h3>
                                <p className="text-muted-foreground">Active Students</p>
                            </div>
                            <div className="flex flex-col items-center space-y-2">
                                <div className="bg-primary/10 p-4 rounded-full">
                                    <Award className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-2xl font-bold text-foreground">95%</h3>
                                <p className="text-muted-foreground">Success Rate</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Courses Section */}
            <section>
                <CoursesSection />
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Everything You Need to Excel</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Our platform provides all the tools and resources you need for effective learning
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Card className="group hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                    <BookOpen className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>Interactive Courses</CardTitle>
                                <CardDescription>
                                    Engage with dynamic content, quizzes, and hands-on projects designed by industry experts
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="group hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                    <Users className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>Collaborative Learning</CardTitle>
                                <CardDescription>
                                    Connect with peers, join study groups, and learn together in our vibrant community
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="group hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                    <Award className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>Certifications</CardTitle>
                                <CardDescription>
                                    Earn industry-recognized certificates to boost your career and showcase your skills
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="group hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                    <Clock className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>Flexible Schedule</CardTitle>
                                <CardDescription>
                                    Learn at your own pace with 24/7 access to all courses and materials
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="group hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                    <CheckCircle className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>Progress Tracking</CardTitle>
                                <CardDescription>
                                    Monitor your learning journey with detailed analytics and personalized insights
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="group hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                    <Star className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>Expert Instructors</CardTitle>
                                <CardDescription>
                                    Learn from industry professionals with years of real-world experience
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section id="about" className="py-20 px-6 bg-muted/30">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-bold mb-6">Why Choose Our LMS?</h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold mb-2">Personalized Learning Paths</h3>
                                        <p className="text-muted-foreground">AI-powered recommendations tailored to your goals and learning style</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold mb-2">Mobile-First Design</h3>
                                        <p className="text-muted-foreground">Learn anywhere, anytime with our responsive platform</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold mb-2">Lifetime Access</h3>
                                        <p className="text-muted-foreground">Once enrolled, access your courses forever with free updates</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold mb-2">24/7 Support</h3>
                                        <p className="text-muted-foreground">Get help whenever you need it from our dedicated support team</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-6xl font-bold text-primary mb-4">50K+</div>
                                    <div className="text-xl font-semibold mb-2">Happy Students</div>
                                    <div className="text-muted-foreground">Join our growing community</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 bg-primary text-primary-foreground">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Career?</h2>
                    <p className="text-xl mb-8 opacity-90">
                        Join thousands of professionals who have advanced their careers through our platform
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" variant="secondary" className="text-lg px-8 cursor-pointer" onClick={() => navigate('/register')}>
                            Start Free Trial
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button size="lg" variant="outline" className="text-lg text-black px-8 hover:bg-primary hover:text-primary-foreground cursor-pointer" onClick={() => navigate('/courses')}>
                            Browse Courses
                        </Button>
                    </div>
                    <p className="text-sm opacity-75 mt-6">
                        ✓ 14-day free trial ✓ No credit card required ✓ Cancel anytime
                    </p>
                </div>
            </section>

        </div>
    )
}

export default Home