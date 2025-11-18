import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types/database';
import { toast } from 'sonner';
import { z } from 'zod';
import { encryptMessage, decryptMessage } from '@/utils/encryption';

const messageSchema = z.object({
  content: z.string()
    .trim()
    .min(1, { message: "Message cannot be empty" })
    .max(2000, { message: "Message must be less than 2000 characters" }),
  receiver_id: z.string().uuid({ message: "Invalid receiver ID" }),
  property_id: z.string().uuid({ message: "Invalid property ID" }).optional(),
});

export function useMessages(userId: string | undefined) {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch sender and receiver profiles separately
      const userIds = new Set<string>();
      (data || []).forEach((msg: any) => {
        userIds.add(msg.sender_id);
        userIds.add(msg.receiver_id);
      });

      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', Array.from(userIds));

      const profilesMap = new Map(
        (profilesData || []).map(p => [p.id, p])
      );

      // Enrich and decrypt messages with profile data
      const enrichedData = await Promise.all(
        (data || []).map(async (msg: any) => {
          let decryptedContent = msg.content;
          
          // Decrypt message content
          try {
            decryptedContent = await decryptMessage(
              msg.content,
              msg.sender_id,
              msg.receiver_id
            );
          } catch (error) {
            console.error('Failed to decrypt message:', error);
          }
          
          return {
            ...msg,
            content: decryptedContent,
            sender: profilesMap.get(msg.sender_id),
            receiver: profilesMap.get(msg.receiver_id)
          };
        })
      );

      // Group messages by conversation
      const grouped = (enrichedData || []).reduce((acc: any, msg: any) => {
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

      // Sort messages within each conversation (oldest first for chat display)
      Object.values(grouped).forEach((conv: any) => {
        conv.messages.sort((a: any, b: any) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      });

      setConversations(Object.values(grouped));
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchConversations();

    if (!userId) return;

    // Throttled real-time subscription for live messages
    let updateTimeout: NodeJS.Timeout;
    const channel = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `or(sender_id.eq.${userId},receiver_id.eq.${userId})`
        },
        () => {
          clearTimeout(updateTimeout);
          updateTimeout = setTimeout(() => fetchConversations(), 500);
        }
      )
      .subscribe();

    return () => {
      clearTimeout(updateTimeout);
      supabase.removeChannel(channel);
    };
  }, [userId, fetchConversations]);

  const sendMessage = async (receiverId: string, content: string, propertyId?: string) => {
    if (!userId) {
      toast.error('Please login to send messages');
      return;
    }

    try {
      // Validate input before sending
      const validatedData = messageSchema.parse({
        content,
        receiver_id: receiverId,
        property_id: propertyId,
      });

      // Encrypt message content before sending
      const encryptedContent = await encryptMessage(
        validatedData.content,
        userId,
        validatedData.receiver_id
      );

      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: userId,
          receiver_id: validatedData.receiver_id,
          content: encryptedContent,
          property_id: validatedData.property_id || null,
        });

      if (error) throw error;
      
      toast.success('Message sent');
      fetchConversations();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        console.error('Error sending message:', error);
        toast.error('Failed to send message');
      }
    }
  };

  const markAsRead = async (conversationUserId: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('receiver_id', userId)
        .eq('sender_id', conversationUserId)
        .eq('read', false);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!userId) {
      toast.error('Please login to delete messages');
      return;
    }

    try {
      console.log('🗑️ Deleting message:', messageId);
      
      // Hard delete - permanently remove from database
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId)
        .eq('sender_id', userId); // Only sender can delete their own messages

      if (error) {
        console.error('❌ Delete message error:', error);
        throw error;
      }
      
      console.log('✅ Message deleted successfully');
      toast.success('Message deleted');
      
      // Immediately update local state for instant UI update
      setConversations(prevConvs => 
        prevConvs.map(conv => ({
          ...conv,
          messages: conv.messages.filter((msg: any) => msg.id !== messageId),
          lastMessage: conv.messages.filter((msg: any) => msg.id !== messageId)[0]
        })).filter(conv => conv.messages.length > 0)
      );
    } catch (error: any) {
      console.error('Error deleting message:', error);
      toast.error(error.message || 'Failed to delete message');
    }
  };

  const editMessage = async (messageId: string, newContent: string) => {
    if (!userId) {
      toast.error('Please login to edit messages');
      return;
    }

    try {
      // Validate new content
      const validatedData = messageSchema.parse({
        content: newContent,
        receiver_id: userId, // Dummy value for validation
      });

      console.log('✏️ Editing message:', messageId);

      // Encrypt new content
      const { data: messageData } = await supabase
        .from('messages')
        .select('receiver_id')
        .eq('id', messageId)
        .single();

      if (!messageData) {
        throw new Error('Message not found');
      }

      const encryptedContent = await encryptMessage(
        validatedData.content,
        userId,
        messageData.receiver_id
      );

      const { error } = await supabase
        .from('messages')
        .update({ 
          content: encryptedContent,
          edited: true,
          edited_at: new Date().toISOString()
        } as any)
        .eq('id', messageId)
        .eq('sender_id', userId); // Only sender can edit their own messages

      if (error) {
        console.error('❌ Edit message error:', error);
        throw error;
      }
      
      console.log('✅ Message edited successfully');
      toast.success('Message updated');
      
      // Immediately update local state for instant UI update
      setConversations(prevConvs => 
        prevConvs.map(conv => ({
          ...conv,
          messages: conv.messages.map((msg: any) => 
            msg.id === messageId 
              ? { ...msg, content: validatedData.content, edited: true, edited_at: new Date().toISOString() }
              : msg
          )
        }))
      );
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        console.error('Error editing message:', error);
        toast.error(error.message || 'Failed to edit message');
      }
    }
  };

  const deleteConversation = async (conversationUserId: string) => {
    if (!userId) {
      toast.error('Please login to delete conversations');
      return;
    }

    try {
      console.log('🗑️ Deleting entire conversation with:', conversationUserId);
      
      // Delete all messages where user is sender and other is receiver
      const { error: error1 } = await supabase
        .from('messages')
        .delete()
        .eq('sender_id', userId)
        .eq('receiver_id', conversationUserId);

      if (error1) {
        console.error('❌ Delete conversation error (sent messages):', error1);
        throw error1;
      }

      // Delete all messages where other is sender and user is receiver
      const { error: error2 } = await supabase
        .from('messages')
        .delete()
        .eq('sender_id', conversationUserId)
        .eq('receiver_id', userId);

      if (error2) {
        console.error('❌ Delete conversation error (received messages):', error2);
        throw error2;
      }
      
      console.log('✅ Conversation deleted successfully');
      toast.success('Conversation deleted');
      
      // Immediately update local state to remove the conversation
      setConversations(prevConvs => 
        prevConvs.filter(conv => conv.user?.id !== conversationUserId)
      );
    } catch (error: any) {
      console.error('Error deleting conversation:', error);
      toast.error(error.message || 'Failed to delete conversation');
    }
  };

  return { 
    conversations, 
    loading, 
    sendMessage, 
    markAsRead, 
    deleteMessage, 
    editMessage, 
    deleteConversation,
    refetch: fetchConversations 
  };
}
