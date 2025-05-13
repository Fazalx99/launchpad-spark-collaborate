
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import useDashboardData from "@/hooks/useDashboardData";
import { formatDate } from "@/utils/formatters";
import LoadingSpinner from "@/components/dashboard/LoadingSpinner";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import ProjectsList from "@/components/dashboard/ProjectsList";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { myProjects, appliedProjects, recentActivity, isLoading } = useDashboardData();
  const navigate = useNavigate();
  
  const handleTabChange = (value: string) => {
    if (value === "explore") {
      navigate("/explore");
    } else {
      setActiveTab(value);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <LoadingSpinner />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <DashboardHeader />

          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-8">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="myProjects">My Projects</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="explore">Explore</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <DashboardOverview 
                myProjects={myProjects} 
                appliedProjects={appliedProjects} 
                recentActivity={recentActivity} 
                formatDate={formatDate}
              />
            </TabsContent>
            
            <TabsContent value="myProjects" className="space-y-6 animate-fade-in">
              <ProjectsList 
                projects={myProjects} 
                emptyTitle="No projects yet"
                emptyDescription="Create your first startup project"
                emptyActionUrl="/projects/new"
                emptyActionLabel="New Project"
              />
            </TabsContent>
            
            <TabsContent value="applications" className="space-y-6 animate-fade-in">
              <ProjectsList 
                projects={appliedProjects} 
                emptyTitle="No applications yet"
                emptyDescription="Explore projects and apply to roles"
                emptyActionUrl="/explore"
                emptyActionLabel="Explore Projects"
              />
            </TabsContent>
            
            {/* We removed the Explore tab content since we now navigate to the /explore page */}
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
