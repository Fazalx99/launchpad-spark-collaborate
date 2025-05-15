
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useState } from "react";
import { ApplicationModal } from "./ApplicationModal";

export interface RoleCardProps {
  id: string;
  title: string;
  projectId: string;
  description: string;
  skills: string[];
  commitment: "full-time" | "part-time" | "flexible";
  remote: boolean;
}

export default function RoleCard({ role, projectTitle }: { role: RoleCardProps; projectTitle?: string }) {
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  
  const commitmentBadges = {
    "full-time": "bg-blue-100 text-blue-800",
    "part-time": "bg-purple-100 text-purple-800",
    "flexible": "bg-green-100 text-green-800"
  };

  return (
    <>
      <Card className="hover-card border-gray-100">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold">{role.title}</h3>
            <Badge variant="outline" className={commitmentBadges[role.commitment]}>
              {role.commitment.replace('-', ' ')}
            </Badge>
          </div>
          
          <p className="text-gray-600 text-sm mb-4">{role.description}</p>
          
          <div className="mb-3">
            <div className="text-sm font-medium mb-2">Required skills:</div>
            <div className="flex flex-wrap gap-2">
              {role.skills.map((skill, index) => (
                <Badge key={index} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </div>
          
          <div className="text-sm">
            <Badge variant="outline" className="mr-2">
              {role.remote ? 'Remote' : 'On-site'}
            </Badge>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4 flex justify-end bg-gray-50">
          <Button size="sm" onClick={() => setShowApplicationModal(true)}>
            Apply Now
          </Button>
        </CardFooter>
      </Card>
      
      {showApplicationModal && (
        <ApplicationModal
          isOpen={showApplicationModal}
          onClose={() => setShowApplicationModal(false)}
          role={role}
          projectId={role.projectId}
          projectTitle={projectTitle || "Project"}
        />
      )}
    </>
  );
}
