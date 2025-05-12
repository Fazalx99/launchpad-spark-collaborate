import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Users, Clock, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import ProjectCard from "@/components/ProjectCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [myProjects, setMyProjects] = useState([]);
  const [appliedProjects, setAppliedProjects] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    if (!user) return;
    
    async function fetchData() {
      try {
        setIsLoading(true);
        
        // Fetch user's projects
        const { data: projects, error: projectsError } = await supabase
          .from("projects")
          .select(`
            *,
            roles(count)
          `)
          .eq("creator_id", user.id)
          .order("created_at", { ascending: false });
          
        if (projectsError) throw projectsError;
        
        // Fetch ALL projects for the "Explore" tab (new)
        const { data: allProjects, error: allProjectsError } = await supabase
          .from("projects")
          .select(`
            *,
            roles(count)
          `)
          .order("created_at", { ascending: false });
          
        if (allProjectsError) throw allProjectsError;
        console.log("All projects:", allProjects); // Debug log
        
        // Fetch projects user has applied to
        const { data: applications, error: applicationsError } = await supabase
          .from("applications")
          .select(`
            *,
            roles(
              *,
              projects(*)
            )
          `)
          .eq("applicant_id", user.id)
          .order("created_at", { ascending: false });
          
        if (applicationsError) throw applicationsError;
        
        // Process application data to extract projects
        const appliedProjectsData = applications?.map(app => ({
          id: app.roles.projects.id,
          title: app.roles.projects.title,
          description: app.roles.projects.description,
          category: app.roles.projects.category,
          openRoles: 0, // We'll need another query for this if needed
          teamSize: app.roles.projects.team_size,
          stage: app.roles.projects.stage,
          createdAt: app.roles.projects.created_at,
        })) || [];
        
        // Format projects data
        const formattedProjects = projects?.map(project => ({
          id: project.id,
          title: project.title,
          description: project.description,
          category: project.category,
          openRoles: project.roles[0].count,
          teamSize: project.team_size,
          stage: project.stage,
          createdAt: project.created_at,
        })) || [];

        setMyProjects(formattedProjects);
        setAppliedProjects(appliedProjectsData);
        
        // TODO: Fetch recent activity (simplified for now)
        setRecentActivity([
          { type: "application", project: "Recent Project", role: "Developer", date: new Date().toISOString() },
        ]);
      } catch (error: any) {
        toast({
          title: "Error loading dashboard",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, [user, toast]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

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
              <TabsTrigger value="explore">Explore</TabsTrigger> {/* New tab for exploring all projects */}
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
                          {myProjects.reduce((sum: number, project: any) => sum + (project.openRoles || 0), 0)}
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
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity, index) => (
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
                          <p className="text-sm text-gray-500 mt-1">{formatDate(activity.date)}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-gray-500">
                      No recent activity
                    </div>
                  )}
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
                {myProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {myProjects.slice(0, 2).map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                ) : (
                  <Card className="p-6">
                    <div className="text-center py-6">
                      <h3 className="text-lg font-medium mb-2">No projects yet</h3>
                      <p className="text-gray-500 mb-4">Create your first startup project</p>
                      <Button asChild>
                        <Link to="/projects/new">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          New Project
                        </Link>
                      </Button>
                    </div>
                  </Card>
                )}
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
            
            <TabsContent value="explore" className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Explore Projects</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* We'll use a new query to fetch all projects, not just the user's */}
                {myProjects.length > 0 ? (
                  myProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))
                ) : (
                  <div className="col-span-3 text-center py-16">
                    <h3 className="text-lg font-medium mb-2">No projects found</h3>
                    <p className="text-gray-500 mb-4">Be the first to create a project!</p>
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
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
