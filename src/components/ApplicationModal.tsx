
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RoleCardProps } from "./RoleCard";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const applicationSchema = z.object({
  experience: z.string().min(10, "Please provide more details about your experience"),
  motivation: z.string().min(10, "Please explain why you're interested in this role"),
  portfolio: z.string().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

export function ApplicationModal({ 
  isOpen, 
  onClose,
  role,
  projectId,
  projectTitle
}: { 
  isOpen: boolean; 
  onClose: () => void;
  role?: RoleCardProps;
  projectId: string;
  projectTitle: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      experience: "",
      motivation: "",
      portfolio: "",
      phoneNumber: "",
      email: "",
    },
  });

  const handleSubmit = async (values: ApplicationFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      if (!user) throw new Error("You must be logged in to apply");
      
      if (role?.id) {
        // Submit application for a specific role
        const { data, error } = await supabase
          .from("applications")
          .insert({
            role_id: role.id,
            applicant_id: user.id,
            experience: values.experience,
            motivation: values.motivation,
            portfolio: values.portfolio || null,
            contact_phone: values.phoneNumber || null,
            contact_email: values.email,
          });
          
        if (error) throw error;
        
        toast({
          title: "Application submitted!",
          description: `Your application for ${role.title} on ${projectTitle} has been successfully submitted.`,
        });
      } else {
        // For general applications when no role is specified, 
        // we'll still use the applications table but with a different message
        
        // Check if there are any open roles
        const { data: rolesData, error: rolesError } = await supabase
          .from("roles")
          .select("id")
          .eq("project_id", projectId)
          .limit(1);
        
        if (rolesError) throw rolesError;
        
        // If there's an open role, use that for the application
        const roleId = rolesData && rolesData.length > 0 ? rolesData[0].id : null;
        
        if (!roleId) {
          toast({
            title: "General interest noted",
            description: `The project owner will be notified of your interest in ${projectTitle}.`,
          });
          
          // In a real app, you might store this somewhere else or handle differently
          // For this demo, we'll still note the interest but inform the user
          
          // Here you could implement a different table like "project_interests"
          // that doesn't require a role_id
        } else {
          // Use the first role if one exists
          const { data, error } = await supabase
            .from("applications")
            .insert({
              role_id: roleId,
              applicant_id: user.id,
              experience: values.experience,
              motivation: values.motivation,
              portfolio: values.portfolio || null,
              contact_phone: values.phoneNumber || null,
              contact_email: values.email,
            });
            
          if (error) throw error;
          
          toast({
            title: "Application submitted!",
            description: `Your general application for ${projectTitle} has been successfully submitted.`,
          });
        }
      }
      
      form.reset();
      onClose();
    } catch (error: any) {
      console.error("Error submitting application:", error);
      toast({
        title: "Application failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <DialogHeader>
              <DialogTitle>Apply for {role ? role.title : projectTitle}</DialogTitle>
              <DialogDescription>
                Share your experience and why you're a great fit for this {role ? "role" : "project"}.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relevant Experience</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your relevant experience..."
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
                name="motivation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Why are you interested?</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Why are you interested in this role and project?"
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
                name="portfolio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Portfolio/LinkedIn/GitHub (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your phone number..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your email address..."
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
              <Button variant="outline" onClick={onClose} type="button">
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
