
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import RoleCard, { RoleCardProps } from "@/components/RoleCard";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

interface ProjectTabsProps {
  description: string;
  roles: RoleCardProps[];
  teamMembers: TeamMember[];
}

export default function ProjectTabs({ description, roles, teamMembers }: ProjectTabsProps) {
  return (
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
              <p>{description}</p>
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
  );
}
