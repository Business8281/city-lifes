-- Enable real-time for messages table for instant messaging updates
ALTER TABLE public.messages REPLICA IDENTITY FULL;

-- Create indexes for faster message queries
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(sender_id, receiver_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON public.messages(receiver_id, read, created_at DESC);

COMMENT ON INDEX idx_messages_conversation IS 'Optimizes conversation queries for faster message loading';
COMMENT ON INDEX idx_messages_receiver IS 'Optimizes unread message queries';