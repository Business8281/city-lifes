import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, MessageSquare, Heart, Home, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";

const Notifications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { notifications, loading, markAsRead } = useNotifications(user?.id);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = async () => {
    for (const notification of notifications.filter(n => !n.read)) {
      await markAsRead(notification.id);
    }
  };

  const getIcon = (type: string) => {
    const icons = {
      message: MessageSquare,
      inquiry: Bell,
      favorite: Heart,
      listing: Home,
    };
    const Icon = icons[type as keyof typeof icons] || Bell;
    return <Icon className="h-5 w-5" />;
  };

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((n) => !n.read)
      : notifications;

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-8 flex items-center justify-center">
        <div className="text-muted-foreground">Loading notifications...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8 overflow-x-hidden max-w-full">
      <div className="sticky top-0 z-40 bg-background border-b max-w-full overflow-x-hidden">
        <div className="max-w-4xl mx-auto px-4 py-4 overflow-x-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">Notifications</h1>
                {unreadCount > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {unreadCount} unread
                  </p>
                )}
              </div>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="gap-2"
              >
                <CheckCheck className="h-4 w-4" />
                Mark all read
              </Button>
            )}
          </div>

          <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">
                All
              </TabsTrigger>
              <TabsTrigger value="unread" className="flex-1">
                Unread ({unreadCount})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 overflow-x-hidden">
        {filteredNotifications.length > 0 ? (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`p-4 cursor-pointer transition-colors ${
                  !notification.read ? "bg-primary/5 border-primary/20" : ""
                }`}
                onClick={() => {
                  markAsRead(notification.id);
                  if (notification.link) {
                    navigate(notification.link);
                  }
                }}
              >
                <div className="flex gap-4">
                  <div
                    className={`p-3 rounded-full shrink-0 ${
                      !notification.read
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {getIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3
                        className={`font-semibold ${
                          !notification.read ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <Badge variant="default" className="shrink-0">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4">🔔</div>
            <h3 className="text-xl font-semibold mb-2">No notifications</h3>
            <p className="text-muted-foreground">
              {filter === "unread"
                ? "You're all caught up!"
                : "You'll see notifications here when you have new activity"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
