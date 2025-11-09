import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Edit, Trash2, Eye, MoreVertical, Circle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
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
import { useAuth } from "@/contexts/AuthContext";
import { useMyListings } from "@/hooks/useProperties";
import { format } from "date-fns";
import { toast } from "sonner";

const MyListings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { properties, loading, deleteProperty, updatePropertyStatus } = useMyListings(user?.id);
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const handleDelete = async () => {
    if (deleteDialog) {
      await deleteProperty(deleteDialog);
      setDeleteDialog(null);
    }
  };

  const getStatusBadge = (status: string, available: boolean) => {
    if (status === 'rented') {
      return <Badge variant="secondary" className="bg-orange-500/20 text-orange-700 dark:text-orange-400">Rented</Badge>;
    }
    if (status === 'active' && available) {
      return <Badge variant="default" className="bg-green-500/20 text-green-700 dark:text-green-400">Available</Badge>;
    }
    return <Badge variant="secondary" className="bg-gray-500/20 text-gray-700 dark:text-gray-400">Unavailable</Badge>;
  };

  const getCurrentStatus = (property: any): 'available' | 'rented' | 'unavailable' => {
    if (property.status === 'rented') return 'rented';
    if (property.status === 'active' && property.available) return 'available';
    return 'unavailable';
  };

  const handleStatusChange = async (propertyId: string, newStatus: 'available' | 'rented' | 'unavailable') => {
    setUpdatingStatus(propertyId);
    await updatePropertyStatus(propertyId, newStatus);
    setUpdatingStatus(null);
  };


  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8 overflow-x-hidden max-w-full">
      <div className="sticky top-0 z-40 bg-background border-b max-w-full overflow-x-hidden">
        <div className="max-w-6xl mx-auto px-4 py-4 overflow-x-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">My Listings</h1>
                <p className="text-sm text-muted-foreground">
                  {properties.length} listing{properties.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <Button onClick={() => navigate("/add-property")} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Property
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 overflow-x-hidden">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="text-muted-foreground">Loading your listings...</div>
          </div>
        ) : properties.length > 0 ? (
          <div className="grid gap-4">
            {properties.map((listing) => (
              <Card key={listing.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-64 h-48 md:h-auto">
                    <img
                      src={listing.images[0] || '/placeholder.svg'}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">
                            {listing.title}
                          </h3>
                          {getStatusBadge(listing.status, listing.available)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {listing.area}, {listing.city} - {listing.pin_code}
                        </p>
                        <p className="text-xl font-bold text-primary">
                          ₹{listing.price.toLocaleString()}
                          <span className="text-sm font-normal text-muted-foreground">
                            /month
                          </span>
                        </p>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="bg-primary/10">
                              {updatingStatus === listing.id ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Circle className="h-4 w-4 mr-2 fill-current" />
                              )}
                              Change Status
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent className="bg-popover border">
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(listing.id, 'available')}
                                disabled={updatingStatus === listing.id}
                                className={getCurrentStatus(listing) === 'available' ? 'bg-green-500/20 text-green-700 dark:text-green-400' : ''}
                              >
                                <Circle className="h-4 w-4 mr-2 fill-green-500 text-green-500" />
                                Available {getCurrentStatus(listing) === 'available' && '✓'}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(listing.id, 'rented')}
                                disabled={updatingStatus === listing.id}
                                className={getCurrentStatus(listing) === 'rented' ? 'bg-orange-500/20 text-orange-700 dark:text-orange-400' : ''}
                              >
                                <Circle className="h-4 w-4 mr-2 fill-orange-500 text-orange-500" />
                                Rented {getCurrentStatus(listing) === 'rented' && '✓'}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(listing.id, 'unavailable')}
                                disabled={updatingStatus === listing.id}
                                className={getCurrentStatus(listing) === 'unavailable' ? 'bg-gray-500/20 text-gray-700 dark:text-gray-400' : ''}
                              >
                                <Circle className="h-4 w-4 mr-2 fill-gray-500 text-gray-500" />
                                Unavailable {getCurrentStatus(listing) === 'unavailable' && '✓'}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                          <DropdownMenuItem
                            onClick={() => navigate(`/property/${listing.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/add-property?edit=${listing.id}`)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteDialog(listing.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex gap-6 text-sm">
                      <div>
                        <p className="text-muted-foreground">Views</p>
                        <p className="font-semibold">{listing.views}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Posted</p>
                        <p className="font-semibold">{format(new Date(listing.created_at), 'PPP')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">No listings yet</h3>
            <p className="text-muted-foreground mb-6">
              Start by adding your first property listing
            </p>
            <Button onClick={() => navigate("/add-property")} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Property
            </Button>
          </div>
        )}
      </div>

      <AlertDialog
        open={!!deleteDialog}
        onOpenChange={() => setDeleteDialog(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Listing</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this listing? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
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

export default MyListings;
