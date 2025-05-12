
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import ProjectCard from "@/components/ProjectCard";

interface ProjectsListProps {
  projects: any[];
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionUrl?: string;
  emptyActionLabel?: string;
}

export default function ProjectsList({ 
  projects, 
  emptyTitle = "No projects yet", 
  emptyDescription = "Create your first startup project", 
  emptyActionUrl = "/projects/new",
  emptyActionLabel = "New Project"
}: ProjectsListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.length > 0 ? (
        projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))
      ) : (
        <div className="col-span-3 text-center py-16">
          <h3 className="text-lg font-medium mb-2">{emptyTitle}</h3>
          <p className="text-gray-500 mb-4">{emptyDescription}</p>
          <Button asChild>
            <Link to={emptyActionUrl}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {emptyActionLabel}
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
