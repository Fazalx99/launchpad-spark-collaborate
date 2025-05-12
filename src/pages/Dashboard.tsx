
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Users, Clock, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import ProjectCard, { ProjectCardProps } from "@/components/ProjectCard";

// Sample data for demonstration
const myProjects = [
  {
    id: "1",
    title: "EcoTrack",
    description: "A mobile app that helps users track and reduce their carbon footprint through daily activities and challenges.",
    category: "Mobile App",
    openRoles: 2,
    teamSize: 3,
    stage: "development",
    createdAt: "2023-05-12T10:00:00Z",
  },
  {
    id: "2",
    title: "CryptoAnalyzer",
    description: "An advanced analytics platform for cryptocurrency traders with real-time data visualization and AI-powered predictions.",
    category: "Web App",
    openRoles: 1,
    teamSize: 4,
    stage: "idea",
    createdAt: "2024-04-25T14:30:00Z",
  },
] as ProjectCardProps[];

const appliedProjects = [
  {
    id: "3",
    title: "HealthHub",
    description: "A comprehensive health tracking platform that integrates with wearable devices and provides personalized insights.",
    category: "Health Tech",
    openRoles: 3,
    teamSize: 2,
    stage: "development",
    createdAt: "2024-05-05T09:15:00Z",
  },
  {
    id: "4",
    title: "RemoteTeam",
    description: "All-in-one tool for remote teams to collaborate, manage tasks, and maintain team culture.",
    category: "SaaS",
    openRoles: 2,
    teamSize: 5,
    stage: "launched",
    createdAt: "2024-03-18T11:45:00Z",
  },
] as ProjectCardProps[];

const recentActivity = [
  { type: "application", project: "DesignAI", role: "UI/UX Designer", date: "2024-05-10T14:30:00Z" },
  { type: "message", from: "Alex Chen", project: "EcoTrack", date: "2024-05-09T09:15:00Z" },
  { type: "role_added", project: "EcoTrack", role: "Backend Developer", date: "2024-05-07T16:45:00Z" },
  { type: "project_update", project: "CryptoAnalyzer", update: "Moved to development stage", date: "2024-05-05T10:30:00Z" },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
              <p className="text-gray-600">Manage your projects and applications</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button asChild>
                <Link to="/projects/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Project
                </Link>
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="myProjects">My Projects</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-500">My Projects</p>
                        <h3 className="text-3xl font-bold mt-1">{myProjects.length}</h3>
                      </div>
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Applications</p>
                        <h3 className="text-3xl font-bold mt-1">{appliedProjects.length}</h3>
                      </div>
                      <div className="p-2 bg-purple-100 rounded-full">
                        <Clock className="h-5 w-5 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Open Roles</p>
                        <h3 className="text-3xl font-bold mt-1">
                          {myProjects.reduce((sum, project) => sum + project.openRoles, 0)}
                        </h3>
                      </div>
                      <div className="p-2 bg-green-100 rounded-full">
                        <PlusCircle className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Recent Activity</h2>
                </div>
                <Card>
                  {recentActivity.map((activity, index) => (
                    <div 
                      key={index} 
                      className={`p-4 flex items-center justify-between ${
                        index !== recentActivity.length - 1 ? "border-b" : ""
                      }`}
                    >
                      <div>
                        {activity.type === "application" && (
                          <p>
                            You applied for <span className="font-medium">{activity.role}</span> at{" "}
                            <Link to="#" className="text-blue-600 hover:underline">{activity.project}</Link>
                          </p>
                        )}
                        {activity.type === "message" && (
                          <p>
                            <span className="font-medium">{activity.from}</span> sent you a message about{" "}
                            <Link to="#" className="text-blue-600 hover:underline">{activity.project}</Link>
                          </p>
                        )}
                        {activity.type === "role_added" && (
                          <p>
                            Added <span className="font-medium">{activity.role}</span> role to{" "}
                            <Link to="#" className="text-blue-600 hover:underline">{activity.project}</Link>
                          </p>
                        )}
                        {activity.type === "project_update" && (
                          <p>
                            <Link to="#" className="text-blue-600 hover:underline">{activity.project}</Link>{" "}
                            {activity.update}
                          </p>
                        )}
                        <p className="text-sm text-gray-500 mt-1">{formatDate(activity.date)}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  ))}
                </Card>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">My Projects</h2>
                  <Button variant="ghost" asChild size="sm">
                    <Link to="/projects">
                      View All <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="myProjects" className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myProjects.length > 0 ? (
                  myProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))
                ) : (
                  <div className="col-span-3 text-center py-16">
                    <h3 className="text-lg font-medium mb-2">No projects yet</h3>
                    <p className="text-gray-500 mb-4">Create your first startup project</p>
                    <Button asChild>
                      <Link to="/projects/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Project
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="applications" className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {appliedProjects.length > 0 ? (
                  appliedProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))
                ) : (
                  <div className="col-span-3 text-center py-16">
                    <h3 className="text-lg font-medium mb-2">No applications yet</h3>
                    <p className="text-gray-500 mb-4">Explore projects and apply to roles</p>
                    <Button asChild>
                      <Link to="/explore">
                        Explore Projects
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
