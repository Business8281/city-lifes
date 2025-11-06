import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types/database';
import { toast } from 'sonner';

export function useMessages(userId: string | undefined) {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id (id, full_name, email),
          receiver:receiver_id (id, full_name, email),
          properties:property_id (id, title)
        `)
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group messages by conversation
      const grouped = (data || []).reduce((acc: any, msg: any) => {
        const otherUserId = msg.sender_id === userId ? msg.receiver_id : msg.sender_id;
        if (!acc[otherUserId]) {
          acc[otherUserId] = {
            user: msg.sender_id === userId ? msg.receiver : msg.sender,
            messages: [],
            lastMessage: msg,
            unreadCount: 0,
          };
        }
        acc[otherUserId].messages.push(msg);
        if (!msg.read && msg.receiver_id === userId) {
          acc[otherUserId].unreadCount++;
        }
        return acc;
      }, {});

      setConversations(Object.values(grouped));
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [userId]);

  const sendMessage = async (receiverId: string, content: string, propertyId?: string) => {
    if (!userId) {
      toast.error('Please login to send messages');
      return;
    }

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: userId,
          receiver_id: receiverId,
          content,
          property_id: propertyId || null,
        });

      if (error) throw error;
      
      toast.success('Message sent');
      fetchConversations();
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  return { conversations, loading, sendMessage, refetch: fetchConversations };
}
