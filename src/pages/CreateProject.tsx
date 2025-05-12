
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CreateProjectForm from "@/components/CreateProjectForm";

export default function CreateProject() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Create a New Project</CardTitle>
              <CardDescription>
                Share your startup idea and find talented teammates to join your vision
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreateProjectForm />
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
