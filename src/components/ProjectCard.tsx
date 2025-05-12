
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  openRoles: number;
  teamSize: number;
  stage: "idea" | "development" | "launched";
  createdAt: string;
}

export default function ProjectCard({ project }: { project: ProjectCardProps }) {
  const stageColors = {
    idea: "bg-amber-100 text-amber-800",
    development: "bg-blue-100 text-blue-800",
    launched: "bg-green-100 text-green-800"
  };

  // Calculate days ago
  const daysAgo = Math.floor(
    (new Date().getTime() - new Date(project.createdAt).getTime()) / 
    (1000 * 3600 * 24)
  );

  return (
    <Card className="hover-card overflow-hidden border-gray-100">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{project.title}</CardTitle>
          <Badge variant="outline" className={stageColors[project.stage]}>
            {project.stage.charAt(0).toUpperCase() + project.stage.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <p className="text-gray-600 line-clamp-3 mb-4">{project.description}</p>
        <Badge variant="secondary" className="mb-5">
          {project.category}
        </Badge>
        <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{project.teamSize} members</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{daysAgo > 0 ? `${daysAgo} days ago` : 'Today'}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4 bg-gray-50">
        <div className="text-sm font-medium">
          {project.openRoles} open {project.openRoles === 1 ? 'role' : 'roles'}
        </div>
        <Button asChild size="sm">
          <Link to={`/projects/${project.id}`}>View Project</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
