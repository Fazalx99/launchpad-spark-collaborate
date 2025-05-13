
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function useDashboardData() {
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
      } catch (error) {
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

  return {
    myProjects,
    appliedProjects,
    recentActivity,
    isLoading
  };
}
