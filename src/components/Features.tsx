
import { Check, Users, Rocket, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Features() {
  const features = [
    {
      icon: <Users className="h-12 w-12 text-blue-500" />,
      title: "Find Your Team",
      description: "Connect with skilled professionals who share your vision. Build the perfect team for your startup idea."
    },
    {
      icon: <Check className="h-12 w-12 text-blue-500" />,
      title: "Apply To Projects",
      description: "Discover exciting startup projects that match your skills and passion. Apply with just a few clicks."
    },
    {
      icon: <Rocket className="h-12 w-12 text-blue-500" />,
      title: "Launch Faster",
      description: "Turn ideas into reality faster with collaborative tools designed for startup teams."
    },
    {
      icon: <MessageSquare className="h-12 w-12 text-blue-500" />,
      title: "Real-time Collaboration",
      description: "Chat, share files, and manage tasks with your team in a unified workspace."
    }
  ];

  return (
    <section id="about" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            StartBridge makes it easy to find teammates, join projects, and collaborate seamlessly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="scroll-reveal hover-card border border-gray-100">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="p-3 bg-blue-50 rounded-xl mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-24 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-10 md:p-16 scroll-reveal">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Build Your Dream Team</h2>
              <p className="text-lg text-gray-600 mb-8">
                Creating a successful startup requires the right people. StartBridge helps you find passionate teammates with the skills you need.
              </p>
              <ul className="space-y-4">
                {[
                  "Post your project and required roles",
                  "Review applications from talented individuals",
                  "Collaborate in real-time with your team",
                  "Launch your startup faster"
                ].map((item, i) => (
                  <li key={i} className="flex items-center">
                    <span className="mr-3 flex-shrink-0 text-green-500">
                      <Check className="h-5 w-5" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl opacity-10 blur-xl transform -rotate-6"></div>
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Team collaboration" 
                  className="relative rounded-xl shadow-lg max-w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
