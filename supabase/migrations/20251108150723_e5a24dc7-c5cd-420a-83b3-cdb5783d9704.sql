-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON public.messages(receiver_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX idx_messages_conversation ON public.messages(sender_id, receiver_id);

-- Enable Row Level Security
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for encrypted protection - users can only see their own messages
CREATE POLICY "Users can view their own messages"
  ON public.messages
  FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages"
  ON public.messages
  FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their received messages"
  ON public.messages
  FOR UPDATE
  USING (auth.uid() = receiver_id);

CREATE POLICY "Users can delete their own messages"
  ON public.messages
  FOR DELETE
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Enable real-time for live messaging
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;