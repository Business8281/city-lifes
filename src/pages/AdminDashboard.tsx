import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Home, MessageSquare, Heart, Eye, CheckCircle, XCircle, Clock, Shield } from "lucide-react";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { useAdminStats } from "@/hooks/useAdminStats";
import { useAdminProperties } from "@/hooks/useAdminProperties";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BottomNav from "@/components/BottomNav";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin, loading } = useAdminCheck();
  const { stats, loading: statsLoading } = useAdminStats();
  const { properties, loading: propertiesLoading, approveProperty, rejectProperty } = useAdminProperties();

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
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">
                  {statsLoading ? "..." : stats.totalUsers}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Home className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Listings</p>
                <p className="text-2xl font-bold">
                  {statsLoading ? "..." : stats.totalProperties}
                </p>
                <p className="text-xs text-muted-foreground">
                  {stats.pendingProperties} pending
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Messages</p>
                <p className="text-2xl font-bold">
                  {statsLoading ? "..." : stats.totalMessages}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Favorites</p>
                <p className="text-2xl font-bold">
                  {statsLoading ? "..." : stats.totalFavorites}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
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
              <p className="text-muted-foreground">User management features coming soon...</p>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Analytics & Reports</h2>
              <p className="text-muted-foreground">Analytics dashboard coming soon...</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
};

export default AdminDashboard;
