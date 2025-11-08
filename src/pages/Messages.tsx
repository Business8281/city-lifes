import { useState } from "react";
import { ArrowLeft, Send, Search, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
}

interface Chat {
  id: string;
  propertyTitle: string;
  ownerName: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  avatar: string;
}

const mockChats: Chat[] = [
  {
    id: "1",
    propertyTitle: "Luxury 3BHK Apartment",
    ownerName: "Rajesh Kumar",
    lastMessage: "The property is available for viewing tomorrow",
    timestamp: "2h ago",
    unread: 2,
    avatar: "RK",
  },
  {
    id: "2",
    propertyTitle: "Independent House with Garden",
    ownerName: "Priya Sharma",
    lastMessage: "Thank you for your interest!",
    timestamp: "1d ago",
    unread: 0,
    avatar: "PS",
  },
  {
    id: "3",
    propertyTitle: "Modern Office Space",
    ownerName: "Metro Properties",
    lastMessage: "Can we schedule a call?",
    timestamp: "3d ago",
    unread: 1,
    avatar: "MP",
  },
];

const mockMessages: Message[] = [
  {
    id: "1",
    senderId: "other",
    text: "Hi! I saw your inquiry about the property.",
    timestamp: "10:30 AM",
    isOwn: false,
  },
  {
    id: "2",
    senderId: "me",
    text: "Yes, I'm interested. Is it still available?",
    timestamp: "10:32 AM",
    isOwn: true,
  },
  {
    id: "3",
    senderId: "other",
    text: "Yes, it's available! Would you like to schedule a viewing?",
    timestamp: "10:35 AM",
    isOwn: false,
  },
  {
    id: "4",
    senderId: "me",
    text: "That would be great! When are you available?",
    timestamp: "10:37 AM",
    isOwn: true,
  },
  {
    id: "5",
    senderId: "other",
    text: "The property is available for viewing tomorrow between 2-5 PM. Would that work for you?",
    timestamp: "10:40 AM",
    isOwn: false,
  },
];

const Messages = () => {
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        senderId: "me",
        text: messageText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true,
      };
      setMessages([...messages, newMessage]);
      setMessageText("");
    }
  };

  const filteredChats = mockChats.filter(
    (chat) =>
      chat.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[100dvh] bg-background pb-20 md:pb-0 overflow-x-hidden max-w-full">
      {/* Chat List */}
      <div className={`${selectedChat ? 'hidden md:flex' : 'flex'} w-full md:w-96 flex-col border-r`}>
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
          {filteredChats.length > 0 ? (
            <div className="divide-y">
              {filteredChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`w-full p-4 hover:bg-muted transition-colors text-left ${
                    selectedChat?.id === chat.id ? 'bg-muted' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    <Avatar className="h-12 w-12 shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {chat.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-sm truncate">{chat.ownerName}</h3>
                        <span className="text-xs text-muted-foreground shrink-0">{chat.timestamp}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1 truncate">
                        {chat.propertyTitle}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {chat.lastMessage}
                      </p>
                    </div>
                    {chat.unread > 0 && (
                      <div className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center shrink-0">
                        {chat.unread}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-muted-foreground">No conversations found</p>
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Chat Window */}
      {selectedChat ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedChat(null)}
              className="md:hidden"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {selectedChat.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="font-semibold">{selectedChat.ownerName}</h2>
              <p className="text-xs text-muted-foreground">{selectedChat.propertyTitle}</p>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.isOwn
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      }`}
                    >
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button onClick={handleSendMessage} size="icon">
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
