
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import ProjectRolesSection from "./project/ProjectRolesSection";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(1, "Please select a category"),
  stage: z.enum(["idea", "development", "launched"]),
});

type FormValues = z.infer<typeof formSchema>;

export interface ProjectRoleFormData {
  title: string;
  description: string;
  skills: string[];
  commitment: "full-time" | "part-time" | "flexible";
  remote: boolean;
}

export default function CreateProjectForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [projectRoles, setProjectRoles] = useState<ProjectRoleFormData[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      stage: "idea",
    },
  });

  const handleAddRole = (role: ProjectRoleFormData) => {
    setProjectRoles([...projectRoles, role]);
  };

  const handleRemoveRole = (index: number) => {
    const updatedRoles = [...projectRoles];
    updatedRoles.splice(index, 1);
    setProjectRoles(updatedRoles);
  };

  async function onSubmit(data: FormValues) {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create a project",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // First create the project
      const { data: projectData, error: projectError } = await supabase.from("projects").insert({
        title: data.title,
        description: data.description,
        category: data.category,
        stage: data.stage,
        creator_id: user.id,
      }).select();

      if (projectError) throw projectError;
      
      const projectId = projectData[0].id;
      
      // Then create the roles if any
      if (projectRoles.length > 0) {
        const rolesToInsert = projectRoles.map(role => ({
          project_id: projectId,
          creator_id: user.id,
          title: role.title,
          description: role.description,
          skills: role.skills,
          commitment: role.commitment,
          remote: role.remote
        }));
        
        const { error: rolesError } = await supabase.from("roles").insert(rolesToInsert);
        
        if (rolesError) throw rolesError;
      }

      toast({
        title: "Project created!",
        description: "Your project has been successfully created with " + 
          (projectRoles.length > 0 ? `${projectRoles.length} role(s)` : "no roles") + ".",
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error creating project",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter your project name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your project, its goals, and the problem it solves"
                  className="min-h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Fintech, Health, Education" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Stage</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="idea">Idea</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="launched">Launched</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Project Roles Section */}
        <div className="border-t pt-6 mt-8">
          <h3 className="text-lg font-medium mb-4">Project Roles</h3>
          <p className="text-sm text-gray-500 mb-6">
            Add roles you're looking to fill in your project team. You can add multiple roles.
          </p>
          
          <ProjectRolesSection 
            projectRoles={projectRoles} 
            onAddRole={handleAddRole}
            onRemoveRole={handleRemoveRole}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Project"}
        </Button>
      </form>
    </Form>
  );
}
