-- Create leads table for lead management
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'interested', 'not_interested', 'closed')),
  source TEXT NOT NULL DEFAULT 'listing' CHECK (source IN ('listing', 'chat', 'whatsapp', 'call')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lead_activity table
CREATE TABLE public.lead_activity (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL CHECK (action_type IN ('status_change', 'note_added', 'contact_made')),
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create crm_clients table
CREATE TABLE public.crm_clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  stage TEXT NOT NULL DEFAULT 'prospect' CHECK (stage IN ('prospect', 'hot', 'warm', 'cold', 'closed')),
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create crm_tasks table
CREATE TABLE public.crm_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.crm_clients(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for leads
CREATE POLICY "Owners can view their leads"
  ON public.leads FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can create leads"
  ON public.leads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Owners can update their leads"
  ON public.leads FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their leads"
  ON public.leads FOR DELETE
  USING (auth.uid() = owner_id);

CREATE POLICY "Management can view all leads"
  ON public.leads FOR SELECT
  USING (is_management_role(auth.uid()));

-- RLS Policies for lead_activity
CREATE POLICY "Owners can view lead activity"
  ON public.lead_activity FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.leads 
    WHERE leads.id = lead_activity.lead_id 
    AND leads.owner_id = auth.uid()
  ));

CREATE POLICY "Owners can create lead activity"
  ON public.lead_activity FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.leads 
    WHERE leads.id = lead_activity.lead_id 
    AND leads.owner_id = auth.uid()
  ));

-- RLS Policies for crm_clients
CREATE POLICY "Owners can manage their clients"
  ON public.crm_clients FOR ALL
  USING (auth.uid() = owner_id);

CREATE POLICY "Management can view all clients"
  ON public.crm_clients FOR SELECT
  USING (is_management_role(auth.uid()));

-- RLS Policies for crm_tasks
CREATE POLICY "Owners can manage their tasks"
  ON public.crm_tasks FOR ALL
  USING (auth.uid() = owner_id);

-- Create indexes for performance
CREATE INDEX idx_leads_owner_id ON public.leads(owner_id);
CREATE INDEX idx_leads_listing_id ON public.leads(listing_id);
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX idx_lead_activity_lead_id ON public.lead_activity(lead_id);
CREATE INDEX idx_crm_clients_owner_id ON public.crm_clients(owner_id);
CREATE INDEX idx_crm_clients_stage ON public.crm_clients(stage);
CREATE INDEX idx_crm_tasks_client_id ON public.crm_tasks(client_id);
CREATE INDEX idx_crm_tasks_owner_id ON public.crm_tasks(owner_id);
CREATE INDEX idx_crm_tasks_due_date ON public.crm_tasks(due_date);

-- Trigger to update updated_at on leads
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger to update updated_at on crm_clients
CREATE TRIGGER update_crm_clients_updated_at
  BEFORE UPDATE ON public.crm_clients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger to update updated_at on crm_tasks
CREATE TRIGGER update_crm_tasks_updated_at
  BEFORE UPDATE ON public.crm_tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to auto-create CRM client when lead becomes interested
CREATE OR REPLACE FUNCTION auto_create_crm_client()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'interested' AND OLD.status != 'interested' THEN
    INSERT INTO public.crm_clients (owner_id, lead_id, name, phone, email, stage)
    VALUES (NEW.owner_id, NEW.id, NEW.name, NEW.phone, NEW.email, 'hot')
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_auto_create_crm_client
  AFTER UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION auto_create_crm_client();

-- Function to log lead activity on status change
CREATE OR REPLACE FUNCTION log_lead_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status != OLD.status THEN
    INSERT INTO public.lead_activity (lead_id, action_type, note)
    VALUES (NEW.id, 'status_change', 'Status changed from ' || OLD.status || ' to ' || NEW.status);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_log_lead_status_change
  AFTER UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION log_lead_status_change();