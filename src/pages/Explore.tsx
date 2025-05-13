
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/dashboard/LoadingSpinner";

export default function Explore() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchAllProjects() {
      try {
        setIsLoading(true);
        
        // Fetch ALL projects without filtering by creator_id
        const { data: allProjects, error } = await supabase
          .from("projects")
          .select(`
            *,
            roles(count)
          `)
          .order("created_at", { ascending: false });
          
        if (error) throw error;
        
        // Format projects data
        const formattedProjects = allProjects?.map(project => ({
          id: project.id,
          title: project.title,
          description: project.description,
          category: project.category,
          openRoles: project.roles[0].count,
          teamSize: project.team_size,
          stage: project.stage,
          createdAt: project.created_at,
        })) || [];

        console.log("Explore - All projects fetched:", formattedProjects);
        setProjects(formattedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast({
          title: "Error loading projects",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchAllProjects();
  }, [toast]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Explore Projects</h1>
            <p className="text-gray-600 mt-1">Discover projects and find roles that match your skills</p>
          </div>

          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))
                ) : (
                  <div className="col-span-3 text-center py-16">
                    <h3 className="text-lg font-medium mb-2">No projects yet</h3>
                    <p className="text-gray-500">Be the first to create a project!</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
