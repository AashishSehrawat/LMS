import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CoursesSection = () => {
  const navigate = useNavigate()
  const technologies = [
    { 
      name: "React", 
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", 
      delay: "0s" 
    },
    { 
      name: "Node.js", 
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", 
      delay: "0.2s" 
    },
    { 
      name: "TypeScript", 
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", 
      delay: "0.4s" 
    },
    { 
      name: "Express.js", 
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg", 
      delay: "0.6s" 
    },
    { 
      name: "Python", 
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", 
      delay: "0.8s" 
    },
    { 
      name: "JavaScript", 
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", 
      delay: "1s" 
    },
  ];

  return (
    <section className="max-w-6xl mx-auto">
      <div className="container mx-auto py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-card-gradient px-4 py-2 rounded-full border border-border shadow-sm">
                <BookOpen className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">
                  Learn. Build. Excel.
                </span>
              </div>
              
              <h1 className="text-4xl font-bold text-foreground">
                Master Modern
                <br />
                Technologies
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
                Dive deep into cutting-edge technologies with hands-on projects, 
                expert instructors, and real-world applications. Start your 
                developer journey today.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={() => navigate('/courses')} className="bg-black cursor-pointer hover:bg-black/80 hover:shadow-glow-primary transition-all duration-300 text-lg px-8 py-6 shadow-lg">
                Browse Courses
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Right Content - Tech Stack */}
          <div className="relative">
            <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
              {technologies.map((tech, index) => (
                <Card 
                  key={index}
                  className="relative p-6 bg-card-gradient border-border hover:border-primary/50 transition-all duration-300 group hover:shadow-lg shadow-sm animate-in fade-in slide-in-from-bottom-4"
                  style={{
                    animationDelay: tech.delay,
                  }}
                >
                  <div className="aspect-square flex items-center justify-center">
                    <img 
                      src={tech.logo} 
                      alt={`${tech.name} logo`}
                      className="w-12 h-12 object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="absolute inset-0 bg-tech-gradient opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-lg"></div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;