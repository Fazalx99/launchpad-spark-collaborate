
import { Link } from "react-router-dom";
import { Users, Clock, PlusCircle, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProjectCard from "@/components/ProjectCard";

interface DashboardOverviewProps {
  myProjects: any[];
  appliedProjects: any[];
  recentActivity: any[];
  formatDate: (dateString: string) => string;
}

export default function DashboardOverview({
  myProjects,
  appliedProjects,
  recentActivity,
  formatDate,
}: DashboardOverviewProps) {
  return (
    <div className="space-y-8 animate-fade-in">
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
                      <Link to="#" className="text-blue-600 hover:underline">
                        {activity.project}
                      </Link>
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">{formatDate(activity.date)}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">No recent activity</div>
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
    </div>
  );
}
