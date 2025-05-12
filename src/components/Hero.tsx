
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  // Simple animation for elements with scroll-reveal class
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.scroll-reveal').forEach(el => {
      observer.observe(el);
    });
    
    return () => {
      document.querySelectorAll('.scroll-reveal').forEach(el => {
        observer.unobserve(el);
      });
    };
  }, []);
  
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white py-24 md:py-32">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-blue-100"></div>
        <div className="absolute top-1/3 -left-20 h-64 w-64 rounded-full bg-indigo-100"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="scroll-reveal text-5xl md:text-6xl font-bold mb-6">
            Connect, Collaborate, <span className="text-gradient">Create</span>
          </h1>
          
          <p className="scroll-reveal text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto" style={{ transitionDelay: "0.1s" }}>
            Join a community of innovators and build groundbreaking startups together. Find skilled teammates or exciting projects to contribute to.
          </p>
          
          <div className="scroll-reveal flex flex-col sm:flex-row gap-4 justify-center" style={{ transitionDelay: "0.2s" }}>
            <Button size="lg" asChild>
              <Link to="/dashboard">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/explore">Explore Projects</Link>
            </Button>
          </div>
          
          <div className="mt-16 scroll-reveal" style={{ transitionDelay: "0.3s" }}>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-1 mx-auto max-w-3xl border border-gray-200">
              <img
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80"
                alt="Team collaboration"
                className="w-full h-auto rounded-xl"
              />
            </div>
            <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-500">
              <span>Join 5,000+ innovators</span>
              <span>•</span>
              <span>1,200+ active projects</span>
              <span>•</span>
              <span>Success rate 78%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
