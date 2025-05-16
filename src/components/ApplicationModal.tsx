
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
      
      // If no specific role was selected, show an error
      if (!role?.id) {
        throw new Error("Please select a specific role to apply for");
      }
      
      // Submit application
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
