import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Home, MessageSquare, Heart, Eye, CheckCircle, XCircle, Clock, Shield, TrendingUp, Activity, DollarSign, Bell, AlertTriangle } from "lucide-react";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { useAdminStats } from "@/hooks/useAdminStats";
import { useAdminProperties } from "@/hooks/useAdminProperties";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { useAdminReports } from "@/hooks/useAdminReports";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, formatDistanceToNow } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

import { TakeActionDialog } from "@/components/admin/TakeActionDialog";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin, loading } = useAdminCheck();
  const { stats, loading: statsLoading } = useAdminStats();
  const { properties, loading: propertiesLoading, approveProperty, rejectProperty } = useAdminProperties();
  const { users, loading: usersLoading } = useAdminUsers();
  const { reports, loading: reportsLoading, applyAdminAction } = useAdminReports();
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-6 space-y-4">
          <div className="flex items-center gap-3 text-destructive">
            <Shield className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Access Denied</h1>
          </div>
          <Alert variant="destructive">
            <AlertDescription>
              You do not have admin privileges to access this dashboard. Please contact an administrator if you believe this is an error.
            </AlertDescription>
          </Alert>
          <Button onClick={() => navigate("/")} className="w-full">
            Return to Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0 overflow-x-hidden max-w-full">
      <div className="sticky top-0 z-40 bg-background border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage your platform</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 overflow-x-hidden">
        {/* Quick Stats Overview with Live Badge */}
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline" className="gap-2">
            <Activity className="h-3 w-3 animate-pulse text-green-500" />
            <span>Live Updates Active</span>
          </Badge>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">
                  {statsLoading ? "..." : stats.totalUsers}
                </p>
                <p className="text-xs text-muted-foreground">
                  +{stats.newUsersToday} today
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Home className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Properties</p>
                <p className="text-2xl font-bold">
                  {statsLoading ? "..." : stats.totalProperties}
                </p>
                <p className="text-xs text-muted-foreground">
                  {stats.activeProperties} active • {stats.pendingProperties} pending
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Messages</p>
                <p className="text-2xl font-bold">
                  {statsLoading ? "..." : stats.totalMessages}
                </p>
                <p className="text-xs text-muted-foreground">
                  +{stats.messagesToday} today • {stats.unreadMessages} unread
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Eye className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold">
                  {statsLoading ? "..." : stats.totalViews}
                </p>
                <p className="text-xs text-muted-foreground">
                  All properties
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Favorites</p>
                <p className="text-2xl font-bold">
                  {statsLoading ? "..." : stats.totalFavorites}
                </p>
                <p className="text-xs text-muted-foreground">
                  +{stats.favoritesToday} today
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Inquiries</p>
                <p className="text-2xl font-bold">
                  {statsLoading ? "..." : stats.totalInquiries}
                </p>
                <p className="text-xs text-muted-foreground">
                  +{stats.inquiriesToday} today
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Campaigns</p>
                <p className="text-2xl font-bold">
                  {statsLoading ? "..." : stats.totalCampaigns}
                </p>
                <p className="text-xs text-muted-foreground">
                  {stats.activeCampaigns} active
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Avg Price</p>
                <p className="text-2xl font-bold">
                  ₹{statsLoading ? "..." : Math.round(stats.avgPropertyPrice / 1000)}K
                </p>
                <p className="text-xs text-muted-foreground">
                  Per property
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Properties by Type</h3>
            {statsLoading ? (
              <div className="text-center py-4 text-muted-foreground">Loading...</div>
            ) : (
              <div className="space-y-3">
                {Object.entries(stats.propertiesByType).map(([type, count]) => (
                  <div key={type} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize">{type}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                    <Progress
                      value={(count / stats.totalProperties) * 100}
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Top Cities</h3>
            {statsLoading ? (
              <div className="text-center py-4 text-muted-foreground">Loading...</div>
            ) : (
              <div className="space-y-3">
                {Object.entries(stats.topCities).slice(0, 5).map(([city, count]) => (
                  <div key={city} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{city}</span>
                      <span className="font-medium">{count} properties</span>
                    </div>
                    <Progress
                      value={(count / stats.totalProperties) * 100}
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">
                  Pending Listings ({properties.length})
                </h2>
                {propertiesLoading ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-muted-foreground mt-2">Loading properties...</p>
                  </div>
                ) : properties.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No pending properties to review
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {properties.map((property) => (
                          <TableRow key={property.id}>
                            <TableCell className="font-medium max-w-[200px] truncate">
                              {property.title}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{property.property_type}</Badge>
                            </TableCell>
                            <TableCell>
                              {property.profiles?.full_name || property.profiles?.email || 'Unknown'}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {format(new Date(property.created_at), 'MMM dd, yyyy')}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              ₹{property.price.toLocaleString()}
                              <span className="text-xs text-muted-foreground">/{property.price_type}</span>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">
                                <Clock className="h-3 w-3 mr-1" />
                                Pending
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2 flex-wrap">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-1"
                                  onClick={() => approveProperty(property.id)}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-1"
                                  onClick={() => rejectProperty(property.id)}
                                >
                                  <XCircle className="h-4 w-4" />
                                  Reject
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="gap-1"
                                  onClick={() => navigate(`/property/${property.id}`)}
                                >
                                  <Eye className="h-4 w-4" />
                                  View
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">User Management</h2>
              {usersLoading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-muted-foreground mt-2">Loading users...</p>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No users found
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Properties</TableHead>
                        <TableHead>Messages</TableHead>
                        <TableHead>Favorites</TableHead>
                        <TableHead>Last Active</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.full_name || 'N/A'}
                          </TableCell>
                          <TableCell className="text-sm">{user.email}</TableCell>
                          <TableCell className="text-sm whitespace-nowrap">
                            {format(new Date(user.created_at), 'MMM dd, yyyy')}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{user.properties_count}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{user.messages_sent}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{user.favorites_count}</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                            {formatDistanceToNow(new Date(user.last_active), { addSuffix: true })}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">User Reports</h2>
              {reportsLoading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-muted-foreground mt-2">Loading reports...</p>
                </div>
              ) : reports.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No reports found
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Reported User</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">
                            {report.reported_user?.full_name || 'Unknown'}
                            <div className="text-xs text-muted-foreground">{report.reported_user?.email}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{report.reason_type}</Badge>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate" title={report.description}>
                            {report.description}
                          </TableCell>
                          <TableCell>
                            <Badge variant={report.status === 'action_taken' ? 'default' : report.status === 'dismissed' ? 'secondary' : 'destructive'}>
                              {report.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {format(new Date(report.created_at), 'MMM dd, yyyy')}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1"
                              onClick={() => setSelectedReportId(report.id)}
                            >
                              <AlertTriangle className="h-4 w-4" />
                              Take Action
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                {statsLoading ? (
                  <div className="text-center py-4 text-muted-foreground">Loading...</div>
                ) : stats.recentActivity.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">No recent activity</div>
                ) : (
                  <div className="space-y-3">
                    {stats.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Home className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{activity.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Performance Metrics</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Property Approval Rate</span>
                      <span className="font-medium">
                        {stats.totalProperties > 0
                          ? Math.round((stats.verifiedProperties / stats.totalProperties) * 100)
                          : 0}%
                      </span>
                    </div>
                    <Progress
                      value={stats.totalProperties > 0
                        ? (stats.verifiedProperties / stats.totalProperties) * 100
                        : 0}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Active Properties</span>
                      <span className="font-medium">
                        {stats.totalProperties > 0
                          ? Math.round((stats.activeProperties / stats.totalProperties) * 100)
                          : 0}%
                      </span>
                    </div>
                    <Progress
                      value={stats.totalProperties > 0
                        ? (stats.activeProperties / stats.totalProperties) * 100
                        : 0}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Campaign Activity</span>
                      <span className="font-medium">
                        {stats.totalCampaigns > 0
                          ? Math.round((stats.activeCampaigns / stats.totalCampaigns) * 100)
                          : 0}%
                      </span>
                    </div>
                    <Progress
                      value={stats.totalCampaigns > 0
                        ? (stats.activeCampaigns / stats.totalCampaigns) * 100
                        : 0}
                      className="h-2"
                    />
                  </div>
                  <div className="pt-4 border-t">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Growth (This Week)</p>
                        <p className="text-lg font-bold text-green-600">+{stats.newUsersThisWeek}</p>
                        <p className="text-xs text-muted-foreground">New users</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Today's Activity</p>
                        <p className="text-lg font-bold text-blue-600">+{stats.newPropertiesToday}</p>
                        <p className="text-xs text-muted-foreground">New properties</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>


      {selectedReportId && (
        <TakeActionDialog
          open={!!selectedReportId}
          onOpenChange={(open) => !open && setSelectedReportId(null)}
          onAction={(action, notes) => applyAdminAction(selectedReportId, action as any, notes)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
