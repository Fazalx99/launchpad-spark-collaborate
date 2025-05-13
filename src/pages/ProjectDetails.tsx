
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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
import LoadingSpinner from "@/components/dashboard/LoadingSpinner";
import { ApplicationModal } from "@/components/ApplicationModal";

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [project, setProject] = useState<any>(null);
  const [roles, setRoles] = useState<RoleCardProps[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleCardProps | null>(null);
  
  useEffect(() => {
    if (!id) return;
    
    async function fetchProjectDetails() {
      try {
        setIsLoading(true);
        
        // Fetch project details
        const { data: projectData, error: projectError } = await supabase
          .from("projects")
          .select(`
            *,
            profiles(id, full_name, avatar_url)
          `)
          .eq("id", id)
          .single();
          
        if (projectError) throw projectError;
        
        if (!projectData) {
          toast({
            title: "Project not found",
            description: "The project you're looking for doesn't exist or has been removed.",
            variant: "destructive",
          });
          navigate("/dashboard");
          return;
        }
        
        // Fetch project roles
        const { data: rolesData, error: rolesError } = await supabase
          .from("roles")
          .select("*")
          .eq("project_id", id);
          
        if (rolesError) throw rolesError;
        
        // Fetch team members
        const { data: membersData, error: membersError } = await supabase
          .from("project_members")
          .select(`
            *,
            profiles(id, full_name, avatar_url)
          `)
          .eq("project_id", id);
          
        if (membersError) throw membersError;
        
        // Format data
        const formattedRoles = rolesData.map((role: any) => ({
          id: role.id,
          projectId: role.project_id,
          title: role.title,
          description: role.description,
          skills: role.skills,
          commitment: role.commitment,
          remote: role.remote,
        }));
        
        const formattedProject = {
          ...projectData,
          team: membersData.map((member: any) => ({
            id: member.profiles.id,
            name: member.profiles.full_name || "Unknown User",
            role: member.role,
            avatar: member.profiles.avatar_url 
              ? member.profiles.avatar_url 
              : member.profiles.full_name 
                ? `${member.profiles.full_name.charAt(0)}${member.profiles.full_name.split(' ')[1]?.charAt(0) || ''}`
                : "UN"
          })),
          roles: formattedRoles
        };
        
        setProject(formattedProject);
        setRoles(formattedRoles);
        setTeamMembers(formattedProject.team);
      } catch (error: any) {
        console.error("Error fetching project details:", error);
        toast({
          title: "Error loading project",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchProjectDetails();
  }, [id, toast, navigate]);
  
  const handleProjectBookmark = () => {
    toast({
      title: "Project bookmarked!",
      description: `${project.title} has been added to your bookmarks.`,
    });
  };
  
  const handleApplyToProject = () => {
    // If there's only one role, select it automatically
    if (roles.length === 1) {
      setSelectedRole(roles[0]);
    } else {
      // Otherwise, show an empty role modal
      // The user will need to select a specific role in the modal
      setSelectedRole(null);
    }
    setIsApplyModalOpen(true);
  };
  
  const handleRoleApply = (role: RoleCardProps) => {
    setSelectedRole(role);
    setIsApplyModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(new Date(dateString));
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    );
  }
  
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
                      <Badge variant="outline" className={stageColors[project.stage as keyof typeof stageColors]}>
                        {project.stage.charAt(0).toUpperCase() + project.stage.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mt-2 max-w-2xl">{project.description}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button onClick={handleProjectBookmark} variant="outline">
                      Bookmark Project
                    </Button>
                    <Button onClick={handleApplyToProject}>Apply to Project</Button>
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
                      <div className="prose max-w-none">
                        <p>{project.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="roles" className="animate-fade-in space-y-6">
                  <h2 className="text-xl font-semibold">Open Roles</h2>
                  {roles.length > 0 ? (
                    roles.map((role) => (
                      <RoleCard key={role.id} role={role} />
                    ))
                  ) : (
                    <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                      <h3 className="text-lg font-medium mb-2">No open roles</h3>
                      <p className="text-gray-500">This project is not currently looking for new members.</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="team" className="animate-fade-in">
                  <Card>
                    <CardHeader>
                      <h2 className="text-xl font-semibold">Team Members</h2>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {teamMembers.length > 0 ? (
                          teamMembers.map((member) => (
                            <div key={member.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                              <Avatar className="h-10 w-10 mr-4">
                                <AvatarFallback>{member.avatar}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{member.name}</p>
                                <p className="text-sm text-gray-600">{member.role}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-6">
                            <p className="text-gray-500">No team members yet.</p>
                          </div>
                        )}
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
                        <div>{formatDate(project.created_at)}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-500">Team Size</div>
                        <div>{project.team_size} members</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-500">Category</div>
                        <div>{project.category}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold">Open Roles</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {roles.length > 0 ? (
                      roles.map((role) => (
                        <div 
                          key={role.id} 
                          className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleRoleApply(role)}
                        >
                          <div className="font-medium">{role.title}</div>
                          <div className="text-sm text-gray-600 mt-1">{role.commitment.replace('-', ' ')}</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-2">
                        <p className="text-sm text-gray-500">No open roles</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {selectedRole && (
        <ApplicationModal 
          isOpen={isApplyModalOpen} 
          onClose={() => setIsApplyModalOpen(false)}
          role={selectedRole}
          projectId={project.id}
          projectTitle={project.title}
        />
      )}
      
      <Footer />
    </div>
  );
}
