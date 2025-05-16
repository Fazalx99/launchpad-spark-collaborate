
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ProjectRoleFormData } from "@/components/CreateProjectForm";
import { PlusIcon, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const roleSchema = z.object({
  title: z.string().min(1, "Role title is required"),
  description: z.string().min(10, "Please provide a more detailed description"),
  skills: z.string().transform((val) => val.split(',').map(s => s.trim()).filter(s => s !== "")),
  commitment: z.enum(["full-time", "part-time", "flexible"]),
  remote: z.boolean().default(true)
});

type RoleFormValues = z.infer<typeof roleSchema>;

interface ProjectRolesSectionProps {
  projectRoles: ProjectRoleFormData[];
  onAddRole: (role: ProjectRoleFormData) => void;
  onRemoveRole: (index: number) => void;
}

export default function ProjectRolesSection({ projectRoles, onAddRole, onRemoveRole }: ProjectRolesSectionProps) {
  const [isAddingRole, setIsAddingRole] = useState(false);
  
  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      title: "",
      description: "",
      skills: "",
      commitment: "flexible",
      remote: true
    }
  });
  
  const handleAddRole = (values: RoleFormValues) => {
    onAddRole({
      title: values.title,
      description: values.description,
      skills: Array.isArray(values.skills) ? values.skills : [],
      commitment: values.commitment,
      remote: values.remote
    });
    
    form.reset();
    setIsAddingRole(false);
  };

  return (
    <div className="space-y-4">
      {/* Display existing roles */}
      {projectRoles.length > 0 && (
        <div className="space-y-3 mb-6">
          {projectRoles.map((role, index) => (
            <Card key={index} className="relative">
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute top-2 right-2 h-8 w-8 p-0" 
                onClick={() => onRemoveRole(index)}
              >
                <X className="h-4 w-4" />
              </Button>
              
              <CardContent className="pt-6">
                <h4 className="font-medium">{role.title}</h4>
                <p className="text-sm text-gray-600 mt-1 mb-3">{role.description}</p>
                
                <div className="flex flex-wrap gap-1 mt-2">
                  {role.skills.map((skill, skillIndex) => (
                    <Badge key={skillIndex} variant="secondary">{skill}</Badge>
                  ))}
                </div>
                
                <div className="flex items-center gap-2 mt-3 text-sm">
                  <Badge variant="outline">{role.commitment.replace('-', ' ')}</Badge>
                  <Badge variant="outline">{role.remote ? 'Remote' : 'On-site'}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Role Form */}
      {isAddingRole ? (
        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddRole)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Frontend Developer, UX Designer" {...field} />
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
                      <FormLabel>Role Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the responsibilities and requirements for this role"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Required Skills</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter skills separated by commas, e.g. React, TypeScript, UI/UX"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="commitment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time Commitment</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select commitment" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="full-time">Full-time</SelectItem>
                            <SelectItem value="part-time">Part-time</SelectItem>
                            <SelectItem value="flexible">Flexible</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="remote"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Remote Work</FormLabel>
                          <p className="text-sm text-gray-500">
                            Is this role remote-friendly?
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-end space-x-2 pt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsAddingRole(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Add Role
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => setIsAddingRole(true)}
        >
          <PlusIcon className="h-4 w-4 mr-2" /> Add a New Role
        </Button>
      )}
    </div>
  );
}
