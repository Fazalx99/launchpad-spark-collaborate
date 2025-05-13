
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { RoleCardProps } from "@/components/RoleCard";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  stage: string;
  created_at: string;
  team_size: number;
  team: TeamMember[];
  roles: RoleCardProps[];
}

export function useProjectDetails(projectId: string | undefined) {
  const [project, setProject] = useState<Project | null>(null);
  const [roles, setRoles] = useState<RoleCardProps[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!projectId) return;
    
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
          .eq("id", projectId)
          .single();
          
        if (projectError) throw projectError;
        
        if (!projectData) {
          toast({
            title: "Project not found",
            description: "The project you're looking for doesn't exist or has been removed.",
            variant: "destructive",
          });
          return null;
        }
        
        // Fetch project roles
        const { data: rolesData, error: rolesError } = await supabase
          .from("roles")
          .select("*")
          .eq("project_id", projectId);
          
        if (rolesError) throw rolesError;
        
        // Fetch team members
        const { data: membersData, error: membersError } = await supabase
          .from("project_members")
          .select(`
            *,
            profiles(id, full_name, avatar_url)
          `)
          .eq("project_id", projectId);
          
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
        
        return {
          project: formattedProject,
          roles: formattedRoles,
          teamMembers: formattedProject.team
        };
      } catch (error: any) {
        console.error("Error fetching project details:", error);
        toast({
          title: "Error loading project",
          description: error.message,
          variant: "destructive",
        });
        return null;
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchProjectDetails().then((data) => {
      if (data) {
        setProject(data.project);
        setRoles(data.roles);
        setTeamMembers(data.teamMembers);
      }
    });
  }, [projectId, toast]);
  
  return { project, roles, teamMembers, isLoading };
}
