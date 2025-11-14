import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface CreateTicketInput {
  subject?: string;
  description: string;
  files?: File[];
}

export const useSupport = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const createTicket = async ({ subject, description, files = [] }: CreateTicketInput) => {
    if (!user) throw new Error("You must be logged in to submit a support ticket.");
    setLoading(true);
    try {
      const { data: ticket, error } = await (supabase as any)
        .from("support_tickets")
        .insert({ user_id: user.id, subject, description })
        .select()
        .single();

      if (error) throw error;

      const uploaded: { path: string; mime_type: string; size: number }[] = [];
      const failures: { name: string; message: string }[] = [];
      for (const file of files) {
        const path = `${ticket.id}/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase
          .storage
          .from("support-uploads")
          .upload(path, file, { upsert: true, contentType: file.type });
        if (uploadError) {
          failures.push({ name: file.name, message: uploadError.message });
          continue;
        }
        uploaded.push({ path, mime_type: file.type, size: file.size });
      }

      if (uploaded.length) {
        const { error: attachError } = await (supabase as any)
          .from("support_ticket_attachments")
          .insert(uploaded.map(u => ({ ticket_id: ticket.id, ...u })));
        if (attachError) throw attachError;
      }

      if (failures.length && uploaded.length === 0) {
        // If every upload failed, throw a descriptive error so the UI can notify the user
        const first = failures[0];
        throw new Error(`All uploads failed. Example: ${first.name}: ${first.message}`);
      }

      return { ticket };
    } finally {
      setLoading(false);
    }
  };

  return { createTicket, loading };
};
