
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { RoleCardProps } from "./RoleCard";
import { useToast } from "@/hooks/use-toast";

export function ApplicationModal({ 
  isOpen, 
  onClose,
  role 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  role: RoleCardProps;
}) {
  const [experience, setExperience] = useState("");
  const [motivation, setMotivation] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Application submitted!",
        description: `Your application for ${role.title} has been successfully submitted.`,
      });
      setIsSubmitting(false);
      onClose();
      resetForm();
    }, 1000);
  };

  const resetForm = () => {
    setExperience("");
    setMotivation("");
    setPortfolio("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Apply for {role.title}</DialogTitle>
            <DialogDescription>
              Share your experience and why you're a great fit for this role.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="experience">Relevant Experience</Label>
              <Textarea
                id="experience"
                placeholder="Describe your relevant experience..."
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="min-h-[100px]"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="motivation">Why are you interested?</Label>
              <Textarea
                id="motivation"
                placeholder="Why are you interested in this role and project?"
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                className="min-h-[100px]"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="portfolio">Portfolio/LinkedIn/GitHub (Optional)</Label>
              <Input
                id="portfolio"
                placeholder="https://..."
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
