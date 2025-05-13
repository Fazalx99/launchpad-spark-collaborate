
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProjectHeaderProps {
  title: string;
  description: string;
  stage: string;
  onBookmark: () => void;
  onApply: () => void;
}

export default function ProjectHeader({ 
  title, 
  description, 
  stage, 
  onBookmark, 
  onApply 
}: ProjectHeaderProps) {
  const stageColors = {
    idea: "bg-amber-100 text-amber-800",
    development: "bg-blue-100 text-blue-800",
    launched: "bg-green-100 text-green-800"
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 sm:p-10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between space-y-4 md:space-y-0">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold">{title}</h1>
              <Badge variant="outline" className={stageColors[stage as keyof typeof stageColors]}>
                {stage.charAt(0).toUpperCase() + stage.slice(1)}
              </Badge>
            </div>
            <p className="text-gray-600 mt-2 max-w-2xl">{description}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={onBookmark} variant="outline">
              Bookmark Project
            </Button>
            <Button onClick={onApply}>Apply to Project</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
