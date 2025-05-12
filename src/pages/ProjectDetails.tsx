
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Clock, Users, Link as LinkIcon, Edit } from "lucide-react";
import RoleCard, { RoleCardProps } from "@/components/RoleCard";
import { useToast } from "@/hooks/use-toast";

// Mock data for the demo
const projectData = {
  "1": {
    id: "1",
    title: "EcoTrack",
    description: "A mobile app that helps users track and reduce their carbon footprint through daily activities and challenges. Using gamification principles, EcoTrack incentivizes sustainable behavior and provides personalized recommendations for reducing environmental impact.",
    longDescription: `<p>EcoTrack is a mobile application designed to help individuals understand and reduce their carbon footprint through daily activities and personalized challenges.</p>
    <p>The application will use a combination of manual input and integration with other apps (fitness trackers, transportation apps, shopping data) to calculate a user's environmental impact across different areas of life.</p>
    <p>Key features include:</p>
    <ul>
    <li>Carbon footprint calculator with visual breakdowns by category</li>
    <li>Daily and weekly eco-challenges that gradually encourage more sustainable habits</li>
    <li>Community features to compare progress and share tips</li>
    <li>Achievement system with real-world rewards from eco-friendly partner companies</li>
    </ul>
    <p>Our goal is to make sustainable living accessible, engaging, and rewarding for everyone.</p>`,
    category: "Mobile App",
    stage: "development",
    website: "https://ecotrack.example.com",
    createdAt: "2023-05-12T10:00:00Z",
    team: [
      { id: "user1", name: "Jordan Smith", role: "Founder", avatar: "JS" },
      { id: "user2", name: "Alex Wang", role: "UX Designer", avatar: "AW" },
    ],
    roles: [
      {
        id: "role1",
        projectId: "1",
        title: "Mobile Developer",
        description: "Looking for an experienced mobile developer to build the EcoTrack app for iOS and Android using React Native.",
        skills: ["React Native", "TypeScript", "Firebase", "App Development"],
        commitment: "full-time",
        remote: true,
      },
      {
        id: "role2",
        projectId: "1",
        title: "Sustainability Specialist",
        description: "Need a sustainability expert to help develop accurate carbon footprint calculations and meaningful eco-challenges.",
        skills: ["Environmental Science", "Carbon Footprint", "Sustainability"],
        commitment: "part-time",
        remote: true,
      },
    ],
  },
  "2": {
    id: "2",
    title: "CryptoAnalyzer",
    description: "An advanced analytics platform for cryptocurrency traders with real-time data visualization and AI-powered predictions.",
    longDescription: `<p>CryptoAnalyzer is a comprehensive analytics platform designed for cryptocurrency traders and investors, providing real-time data visualization and AI-driven insights.</p>
    <p>The platform aims to simplify complex market data and make it accessible to both experienced traders and newcomers to the crypto space.</p>
    <p>Key features include:</p>
    <ul>
    <li>Real-time price tracking across multiple exchanges</li>
    <li>Advanced technical analysis tools with customizable indicators</li>
    <li>Machine learning algorithms to identify patterns and predict potential market movements</li>
    <li>Portfolio tracking with performance metrics</li>
    <li>Custom alerts for price movements and market conditions</li>
    </ul>
    <p>We're building CryptoAnalyzer to empower traders with data-driven decisions in the volatile cryptocurrency market.</p>`,
    category: "Web App",
    stage: "idea",
    website: "",
    createdAt: "2024-04-25T14:30:00Z",
    team: [
      { id: "user3", name: "Mia Johnson", role: "Founder", avatar: "MJ" },
    ],
    roles: [
      {
        id: "role3",
        projectId: "2",
        title: "Frontend Developer",
        description: "Need a skilled frontend developer with experience in building data visualization dashboards and real-time updates.",
        skills: ["React", "D3.js", "TypeScript", "WebSockets"],
        commitment: "full-time",
        remote: true,
      },
      {
        id: "role4",
        projectId: "2",
        title: "Data Scientist",
        description: "Looking for a data scientist with experience in financial markets and machine learning to develop predictive models.",
        skills: ["Python", "Machine Learning", "Financial Analysis", "Data Modeling"],
        commitment: "part-time",
        remote: true,
      },
      {
        id: "role5",
        projectId: "2",
        title: "Blockchain Developer",
        description: "Need a blockchain developer familiar with multiple cryptocurrencies to help with exchange API integrations.",
        skills: ["Blockchain", "API Integration", "Cryptocurrencies"],
        commitment: "flexible",
        remote: true,
      },
    ],
  },
};

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  // In a real app, you'd fetch project data based on ID
  const project = id ? projectData[id as keyof typeof projectData] : null;
  
  if (!project) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Project not found</h1>
            <p className="text-gray-600 mb-6">The project you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <a href="/dashboard">Back to Dashboard</a>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const stageColors = {
    idea: "bg-amber-100 text-amber-800",
    development: "bg-blue-100 text-blue-800",
    launched: "bg-green-100 text-green-800"
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(new Date(dateString));
  };
  
  const handleProjectBookmark = () => {
    toast({
      title: "Project bookmarked!",
      description: `${project.title} has been added to your bookmarks.`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            {/* Project Header */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 sm:p-10">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between space-y-4 md:space-y-0">
                  <div>
                    <div className="flex items-center space-x-3">
                      <h1 className="text-3xl font-bold">{project.title}</h1>
                      <Badge variant="outline" className={stageColors[project.stage]}>
                        {project.stage.charAt(0).toUpperCase() + project.stage.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mt-2 max-w-2xl">{project.description}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button onClick={handleProjectBookmark} variant="outline">
                      Bookmark Project
                    </Button>
                    <Button>Apply to Role</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Project Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Tabs defaultValue="about" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="roles">Open Roles</TabsTrigger>
                  <TabsTrigger value="team">Team</TabsTrigger>
                </TabsList>
                
                <TabsContent value="about" className="animate-fade-in">
                  <Card>
                    <CardHeader>
                      <h2 className="text-xl font-semibold">About the Project</h2>
                    </CardHeader>
                    <CardContent>
                      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: project.longDescription }} />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="roles" className="animate-fade-in space-y-6">
                  <h2 className="text-xl font-semibold">Open Roles</h2>
                  {project.roles.map((role: RoleCardProps) => (
                    <RoleCard key={role.id} role={role} />
                  ))}
                </TabsContent>
                
                <TabsContent value="team" className="animate-fade-in">
                  <Card>
                    <CardHeader>
                      <h2 className="text-xl font-semibold">Team Members</h2>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {project.team.map((member) => (
                          <div key={member.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                            <Avatar className="h-10 w-10 mr-4">
                              <AvatarFallback>{member.avatar}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-sm text-gray-600">{member.role}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold">Project Details</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-500">Created</div>
                        <div>{formatDate(project.createdAt)}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-500">Team Size</div>
                        <div>{project.team.length} members</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-500">Category</div>
                        <div>{project.category}</div>
                      </div>
                    </div>
                    
                    {project.website && (
                      <div className="flex items-center">
                        <LinkIcon className="h-5 w-5 mr-2 text-gray-500" />
                        <div>
                          <div className="text-sm text-gray-500">Website</div>
                          <a 
                            href={project.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {project.website}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold">Open Roles</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {project.roles.map((role: RoleCardProps) => (
                      <div key={role.id} className="p-3 border rounded-md hover:bg-gray-50">
                        <div className="font-medium">{role.title}</div>
                        <div className="text-sm text-gray-600 mt-1">{role.commitment.replace('-', ' ')}</div>
                      </div>
                    ))}
                  </div>
                  
                  <Button className="w-full mt-4" variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    Add Role
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
