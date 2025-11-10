import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Property } from "@/types/database";
import { toast } from "sonner";
import { useMyListings } from "@/hooks/useProperties";
import { useAuth } from "@/contexts/AuthContext";

const campaignSchema = z.object({
  title: z.string().min(3, "Campaign name is required"),
  property_id: z.string().min(1, "Please select a property"),
  budget: z.string().min(1, "Budget is required"),
  duration: z.string().min(1, "Duration is required"),
  is_free_trial: z.boolean().default(false),
});

type CampaignFormData = z.infer<typeof campaignSchema>;

interface CreateCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property: Property | null;
  onCreateCampaign: (data: any) => Promise<void>;
}

const CreateCampaignDialog = ({ open, onOpenChange, property, onCreateCampaign }: CreateCampaignDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { properties: myProperties, loading: propertiesLoading } = useMyListings(user?.id);

  // Filter only business properties
  const businessProperties = myProperties.filter(p => p.property_type === 'business');

  const form = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      title: "",
      property_id: property?.id || "",
      budget: "",
      duration: "7",
      is_free_trial: false,
    },
  });

  const isFreeTrialEnabled = form.watch("is_free_trial");

  useEffect(() => {
    if (property) {
      form.setValue("property_id", property.id);
    }
  }, [property, form]);

  useEffect(() => {
    if (isFreeTrialEnabled) {
      form.setValue("budget", "10");
      form.setValue("duration", "7");
    }
  }, [isFreeTrialEnabled, form]);

  const onSubmit = async (data: CampaignFormData) => {
    try {
      setIsSubmitting(true);
      
      // Calculate end date based on duration
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + parseInt(data.duration));
      
      await onCreateCampaign({
        property_id: data.property_id,
        title: data.title,
        budget: parseFloat(data.budget),
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
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
      <DialogContent className="max-w-2xl mobile-container max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create New Campaign</DialogTitle>
        </DialogHeader>

        {businessProperties.length === 0 ? (
          <div className="py-12 text-center space-y-4">
            <p className="text-lg text-foreground">
              You don't have any business listings to advertise.
            </p>
            <p className="text-muted-foreground">
              Ad campaigns are only available for business category properties.
            </p>
            <Button onClick={() => onOpenChange(false)} variant="outline">
              Close
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">
                      Campaign Name <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Enter campaign name"
                        className="h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="property_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">
                      Select Property <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={propertiesLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Choose a property from your listings" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {businessProperties.map((prop) => (
                          <SelectItem key={prop.id} value={prop.id}>
                            {prop.title} - {prop.area}, {prop.city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_free_trial"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-start space-x-3 space-y-0 rounded-lg border border-border bg-muted/30 p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-base font-semibold cursor-pointer">
                          Start with Free Trial
                        </FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Test your campaign with ₹10 budget for 7 days - no payment required
                        </p>
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">
                      Campaign Budget (₹) <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          ₹
                        </span>
                        <Input 
                          {...field} 
                          type="number"
                          placeholder="Enter budget in Indian Rupees"
                          className="h-12 pl-8"
                          disabled={isFreeTrialEnabled}
                          min="10"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Campaign Duration</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={isFreeTrialEnabled}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="7">7 Days</SelectItem>
                        <SelectItem value="14">14 Days</SelectItem>
                        <SelectItem value="30">30 Days</SelectItem>
                        <SelectItem value="60">60 Days</SelectItem>
                        <SelectItem value="90">90 Days</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1 h-11"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="flex-1 h-11"
                >
                  {isSubmitting ? "Creating..." : "Create Campaign"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateCampaignDialog;
