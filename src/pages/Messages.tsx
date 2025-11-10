import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Send, Search, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMessages } from "@/hooks/useMessages";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Messages = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { conversations, loading, sendMessage, markAsRead } = useMessages(user?.id);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingNewChat, setLoadingNewChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (messageText.trim() && selectedConversation) {
      await sendMessage(
        selectedConversation.user.id,
        messageText,
        selectedConversation.messages[0]?.property_id
      );
      setMessageText("");
      setTimeout(scrollToBottom, 100);
    }
  };

  // Auto-scroll when messages change or conversation selected
  useEffect(() => {
    if (selectedConversation) {
      setTimeout(scrollToBottom, 100);
    }
  }, [selectedConversation?.messages?.length, selectedConversation?.user?.id]);

  // Mark messages as read when viewing conversation
  useEffect(() => {
    if (selectedConversation?.user?.id && selectedConversation.unreadCount > 0) {
      markAsRead(selectedConversation.user.id);
    }
  }, [selectedConversation?.user?.id]);

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.user?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage?.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle incoming chat request from URL params
  useEffect(() => {
    const initChat = async () => {
      const targetUserId = searchParams.get('user');
      const propertyId = searchParams.get('property');
      
      if (!targetUserId || !user || loadingNewChat) return;
      
      // Check if conversation already exists
      const existingConv = conversations.find(c => c.user?.id === targetUserId);
      
      if (existingConv) {
        setSelectedConversation(existingConv);
      } else {
        // Create new conversation by fetching user profile
        setLoadingNewChat(true);
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('id, full_name, email')
            .eq('id', targetUserId)
            .single();
          
          if (error) throw error;
          
          if (profile) {
            // Create a new conversation object
            const newConv = {
              user: profile,
              messages: [],
              lastMessage: null,
              unreadCount: 0
            };
            setSelectedConversation(newConv);
            
            // Send initial greeting
            if (propertyId) {
              await sendMessage(targetUserId, "Hi! I'm interested in your property.", propertyId);
            }
          }
        } catch (error) {
          console.error('Error starting conversation:', error);
          toast.error('Failed to start conversation');
        } finally {
          setLoadingNewChat(false);
        }
      }
      
      // Clear URL params
      navigate('/messages', { replace: true });
    };
    
    if (!loading && conversations.length >= 0) {
      initChat();
    }
  }, [searchParams, user, conversations, loading]);

  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase() || '?';
  };

  if (loading) {
    return (
      <div className="flex h-[100dvh] items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] bg-background pb-20 md:pb-0 overflow-x-hidden max-w-full">
      {/* Chat List */}
      <div className={`${selectedConversation ? 'hidden md:flex' : 'flex'} w-full md:w-96 flex-col border-r`}>
        <div className="p-4 border-b space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Messages</h1>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          {filteredConversations.length > 0 ? (
            <div className="divide-y">
              {filteredConversations.map((conversation) => (
                <button
                  key={conversation.user?.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`w-full p-4 hover:bg-muted transition-colors text-left ${
                    selectedConversation?.user?.id === conversation.user?.id ? 'bg-muted' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    <Avatar className="h-12 w-12 shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(conversation.user?.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-sm truncate">
                          {conversation.user?.full_name || 'Unknown User'}
                        </h3>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {formatDistanceToNow(new Date(conversation.lastMessage?.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.lastMessage?.content}
                      </p>
                    </div>
                    {conversation.unreadCount > 0 && (
                      <div className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center shrink-0">
                        {conversation.unreadCount}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-muted-foreground">No conversations yet</p>
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Chat Window */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedConversation(null)}
              className="md:hidden"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(selectedConversation.user?.full_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="font-semibold">{selectedConversation.user?.full_name}</h2>
              <p className="text-xs text-muted-foreground">{selectedConversation.user?.email}</p>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            {selectedConversation.messages.length > 0 ? (
              <div className="space-y-4">
                {selectedConversation.messages.map((message: any) => {
                  const isOwn = message.sender_id === user?.id;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          isOwn
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm break-words">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                          }`}
                        >
                          {new Date(message.created_at).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                  <p>No messages yet</p>
                  <p className="text-sm mt-2">Send a message to start the conversation</p>
                </div>
              </div>
            )}
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                disabled={!selectedConversation?.user?.id}
              />
              <Button 
                onClick={handleSendMessage} 
                size="icon"
                disabled={!messageText.trim() || !selectedConversation?.user?.id}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">💬</div>
            <h2 className="text-xl font-semibold mb-2">Select a conversation</h2>
            <p className="text-muted-foreground">
              Choose a chat from the list to view messages
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
