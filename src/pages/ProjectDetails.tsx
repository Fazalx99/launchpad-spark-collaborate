
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/dashboard/LoadingSpinner";
import { ApplicationModal } from "@/components/ApplicationModal";
import { RoleCardProps } from "@/components/RoleCard";
import { useProjectDetails } from "@/hooks/useProjectDetails";
import ProjectHeader from "@/components/project/ProjectHeader";
import ProjectSidebar from "@/components/project/ProjectSidebar";
import ProjectTabs from "@/components/project/ProjectTabs";

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { project, roles, teamMembers, isLoading } = useProjectDetails(id);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleCardProps | null>(null);
  
  const handleProjectBookmark = () => {
    toast({
      title: "Project bookmarked!",
      description: `${project?.title} has been added to your bookmarks.`,
    });
  };
  
  const handleApplyToProject = () => {
    // Always open the apply modal, even if there are no roles
    setSelectedRole(roles.length === 1 ? roles[0] : null);
    setIsApplyModalOpen(true);
  };
  
  const handleRoleApply = (role: RoleCardProps) => {
    setSelectedRole(role);
    setIsApplyModalOpen(true);
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            {/* Project Header */}
            <ProjectHeader 
              title={project.title} 
              description={project.description}
              stage={project.stage}
              onBookmark={handleProjectBookmark}
              onApply={handleApplyToProject}
            />
          </div>
          
          {/* Project Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <ProjectTabs 
                description={project.description}
                roles={roles}
                teamMembers={teamMembers}
              />
            </div>
            
            {/* Sidebar */}
            <ProjectSidebar 
              project={project} 
              roles={roles} 
              onRoleApply={handleRoleApply} 
            />
          </div>
        </div>
      </div>
      
      {isApplyModalOpen && (
        <ApplicationModal 
          isOpen={isApplyModalOpen} 
          onClose={() => setIsApplyModalOpen(false)}
          role={selectedRole || undefined}
          projectId={project.id}
          projectTitle={project.title}
        />
      )}
      
      <Footer />
    </div>
  );
}
