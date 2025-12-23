import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Send, Search, MoreVertical, Trash2, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMessages } from "@/hooks/useMessages";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { messageSchema } from "@/schemas/validationSchemas";

const Messages = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { conversations, loading, sendMessage, markAsRead, deleteMessage, editMessage, deleteConversation } = useMessages(user?.id);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingNewChat, setLoadingNewChat] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState("");
  const [deleteConversationDialog, setDeleteConversationDialog] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTo({ top: scrollContainer.scrollHeight, behavior });
      }
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation) return;

    // Validate message input
    try {
      messageSchema.parse({
        content: messageText,
        receiver_id: selectedConversation.user.id,
        property_id: selectedConversation.messages[0]?.property_id
      });

      await sendMessage(
        selectedConversation.user.id,
        messageText,
        selectedConversation.messages[0]?.property_id
      );
      setMessageText("");
      setTimeout(() => scrollToBottom("auto"), 50);
    } catch (error: any) {
      if (error.errors) {
        toast.error(error.errors[0]?.message || "Invalid message");
      }
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    await deleteMessage(messageId);
  };

  const handleStartEdit = (messageId: string, currentContent: string) => {
    setEditingMessageId(messageId);
    setEditedText(currentContent);
  };

  const handleSaveEdit = async (messageId: string) => {
    if (!editedText.trim()) {
      toast.error("Message cannot be empty");
      return;
    }
    await editMessage(messageId, editedText);
    setEditingMessageId(null);
    setEditedText("");
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditedText("");
  };

  const handleDeleteConversation = async () => {
    if (selectedConversation) {
      await deleteConversation(selectedConversation.user.id);
      setSelectedConversation(null);
      setDeleteConversationDialog(false);
    }
  };

  // Auto-scroll when messages change or conversation selected
  useEffect(() => {
    if (selectedConversation) {
      // Immediate scroll for new conversation, slight delay for new messages
      const delay = selectedConversation.messages.length === 0 ? 50 : 100;
      setTimeout(() => scrollToBottom("auto"), delay);
    }
  }, [selectedConversation]);

  // Mark messages as read when viewing conversation
  useEffect(() => {
    if (selectedConversation?.user?.id && selectedConversation.unreadCount > 0) {
      markAsRead(selectedConversation.user.id);
    }
  }, [selectedConversation?.user?.id, selectedConversation?.unreadCount, markAsRead]);

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
  }, [searchParams, user, conversations, loading, loadingNewChat, navigate, sendMessage]);

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
                  className={`w-full p-4 hover:bg-muted transition-colors text-left ${selectedConversation?.user?.id === conversation.user?.id ? 'bg-muted' : ''
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setDeleteConversationDialog(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Conversation
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            {selectedConversation.messages.length > 0 ? (
              <div className="space-y-4">
                {selectedConversation.messages.map((message: any) => {
                  const isOwn = message.sender_id === user?.id;
                  const isEditing = editingMessageId === message.id;

                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 relative ${isOwn
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                          }`}
                      >
                        {isEditing ? (
                          <div className="space-y-2">
                            <Input
                              value={editedText}
                              onChange={(e) => setEditedText(e.target.value)}
                              className={`text-sm ${isOwn
                                ? 'bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20'
                                : 'bg-background'
                                }`}
                              autoFocus
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant={isOwn ? "secondary" : "default"}
                                onClick={() => handleSaveEdit(message.id)}
                              >
                                <Check className="h-3 w-3 mr-1" />
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleCancelEdit}
                              >
                                <X className="h-3 w-3 mr-1" />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-start gap-2">
                              <p className="text-sm break-words flex-1">{message.content}</p>
                              {isOwn && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className={`h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity ${isOwn ? 'hover:bg-primary-foreground/20' : ''
                                        }`}
                                    >
                                      <MoreVertical className="h-3 w-3" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleStartEdit(message.id, message.content)}>
                                      <Edit2 className="h-3 w-3 mr-2" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => handleDeleteMessage(message.id)}
                                      className="text-destructive focus:text-destructive"
                                    >
                                      <Trash2 className="h-3 w-3 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <p
                                className={`text-xs mt-1 ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                                  }`}
                              >
                                {new Date(message.created_at).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                              {message.edited && (
                                <span
                                  className={`text-xs italic ${isOwn ? 'text-primary-foreground/50' : 'text-muted-foreground/70'
                                    }`}
                                >
                                  (edited)
                                </span>
                              )}
                            </div>
                          </>
                        )}
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

      {/* Delete Conversation Dialog */}
      <AlertDialog
        open={deleteConversationDialog}
        onOpenChange={setDeleteConversationDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this entire conversation with{" "}
              <strong>{selectedConversation?.user?.full_name}</strong>?
              This will permanently delete all messages and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConversation}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Messages;
