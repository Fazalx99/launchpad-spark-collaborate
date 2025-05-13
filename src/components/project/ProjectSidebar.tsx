
import { Clock, Users, Calendar } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { RoleCardProps } from "@/components/RoleCard";

interface ProjectSidebarProps {
  project: {
    created_at: string;
    team_size: number;
    category: string;
  };
  roles: RoleCardProps[];
  onRoleApply: (role: RoleCardProps) => void;
}

export default function ProjectSidebar({ project, roles, onRoleApply }: ProjectSidebarProps) {
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(new Date(dateString));
  };

  return (
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
                  onClick={() => onRoleApply(role)}
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
  );
}
