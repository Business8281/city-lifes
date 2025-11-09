import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Property } from "@/types/database";
import { toast } from "sonner";

const campaignSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  budget: z.string().min(1, "Budget is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
});

type CampaignFormData = z.infer<typeof campaignSchema>;

interface CreateCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property: Property | null;
  onCreateCampaign: (data: CampaignFormData & { property_id: string }) => Promise<void>;
}

const CreateCampaignDialog = ({ open, onOpenChange, property, onCreateCampaign }: CreateCampaignDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      title: property ? `${property.title} - Ad Campaign` : "",
      budget: "",
      start_date: new Date().toISOString().split('T')[0],
      end_date: "",
    },
  });

  const onSubmit = async (data: CampaignFormData) => {
    if (!property) return;

    try {
      setIsSubmitting(true);
      await onCreateCampaign({
        ...data,
        property_id: property.id,
      });
      toast.success("Campaign created successfully!");
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error("Failed to create campaign");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mobile-container">
        <DialogHeader>
          <DialogTitle>Create Ad Campaign</DialogTitle>
        </DialogHeader>

        {property && (
          <div className="mb-4 p-3 bg-muted rounded-lg">
            <p className="font-semibold text-sm mb-1">{property.title}</p>
            <p className="text-xs text-muted-foreground">
              📍 {property.area}, {property.city}
            </p>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter campaign title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget (₹)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" placeholder="10000" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? "Creating..." : "Create Campaign"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCampaignDialog;
