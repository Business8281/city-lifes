import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Edit, Trash2, Eye, MoreVertical, Circle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import type { Property } from "@/types/database";
import { Capacitor } from "@capacitor/core";

const MyListings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { properties, loading, deleteProperty, updatePropertyStatus } = useMyListings(user?.id);
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const isIOS = Capacitor?.getPlatform?.() === 'ios';
  const [localStatus, setLocalStatus] = useState<Record<string, 'available' | 'rented' | 'unavailable'>>({});

  const handleDelete = async () => {
    console.log('🗑️ handleDelete called, deleteDialog:', deleteDialog);
    if (deleteDialog) {
      console.log('✅ deleteDialog is truthy, calling deleteProperty...');
      try {
        await deleteProperty(deleteDialog);
        console.log('✅ deleteProperty completed successfully');
        setDeleteDialog(null);
      } catch (error) {
        console.error('❌ Error in handleDelete:', error);
      }
    } else {
      console.log('❌ deleteDialog is falsy, not calling deleteProperty');
    }
  };

  const getStatusBadge = (status: string, available: boolean) => {
    if (status === 'rented') {
      return <Badge variant="secondary" className="bg-orange-500/20 text-orange-700 dark:text-orange-400">Rented (Hidden)</Badge>;
    }
    if (status === 'active' && available) {
      return <Badge variant="default" className="bg-green-500/20 text-green-700 dark:text-green-400">Available (Live)</Badge>;
    }
    if (status === 'inactive' || status === 'draft') {
      return <Badge variant="secondary" className="bg-gray-500/20 text-gray-700 dark:text-gray-400">Draft</Badge>;
    }
    return <Badge variant="secondary" className="bg-gray-500/20 text-gray-700 dark:text-gray-400">Unavailable</Badge>;
  };

  const getCurrentStatus = (property: Property): 'available' | 'rented' | 'unavailable' => {
    if (property.status === 'rented') return 'rented';
    if (property.status === 'active' && property.available) return 'available';
    if (property.status === 'inactive' || property.status === 'draft') return 'unavailable';
    return 'unavailable';
  };

  const getDisplayStatus = (property: Property): 'available' | 'rented' | 'unavailable' => {
    return localStatus[property.id] ?? getCurrentStatus(property);
  };

  const handleStatusChange = async (propertyId: string, newStatus: 'available' | 'rented' | 'unavailable') => {
    // Local override so UI reflects selection immediately and reliably
    setLocalStatus((prev) => ({ ...prev, [propertyId]: newStatus }));
    setUpdatingStatus(propertyId);
    await updatePropertyStatus(propertyId, newStatus);
    setUpdatingStatus(null);
    // Clear the override shortly after to let actual state take over
    setTimeout(() => {
      setLocalStatus((prev) => {
        const next = { ...prev };
        delete next[propertyId];
        return next;
      });
    }, 200);
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
                  <div className="w-full md:w-56">
                    <div className="relative h-32 md:aspect-[4/3] md:h-auto">
                      <img
                        src={listing.images[0] || '/placeholder.svg'}
                        alt={listing.title}
                        className="absolute inset-0 w-full h-full object-cover rounded-t-md md:rounded-none"
                      />
                    </div>
                  </div>

                  <div className="flex-1 p-4 md:p-6">
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

                      {isIOS ? (
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button aria-label="Listing actions" variant="ghost" size="icon" style={{ touchAction: 'manipulation' }}>
                              <MoreVertical className="h-5 w-5" />
                            </Button>
                          </SheetTrigger>
                          <SheetContent side="bottom" className="pb-8">
                            <SheetHeader>
                              <SheetTitle>Listing actions</SheetTitle>
                            </SheetHeader>
                            <div className="mt-4 space-y-2">
                              {/* Status Change */}
                              <div className="text-xs font-semibold text-muted-foreground px-1">Change Status</div>
                              <button
                                  disabled={updatingStatus === listing.id}
                                  onClick={() => handleStatusChange(listing.id, 'available')}
                                  className={`w-full flex items-center gap-3 rounded-md px-3 py-3 text-left ${getCurrentStatus(listing) === 'available' ? 'bg-green-500/10' : 'hover:bg-accent'}`}
                                >
                                  {updatingStatus === listing.id && getCurrentStatus(listing) !== 'available' ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Circle className="h-4 w-4 fill-green-500 text-green-500" />
                                  )}
                                  <div className="flex flex-col">
                                    <span className="font-medium text-green-700 dark:text-green-400">Available</span>
                                    <span className="text-xs text-muted-foreground">Live - Visible to users</span>
                                  </div>
                                  {getCurrentStatus(listing) === 'available' && <span className="ml-auto">✓</span>}
                                </button>
                              <button
                                  disabled={updatingStatus === listing.id}
                                  onClick={() => handleStatusChange(listing.id, 'rented')}
                                  className={`w-full flex items-center gap-3 rounded-md px-3 py-3 text-left ${getCurrentStatus(listing) === 'rented' ? 'bg-orange-500/10' : 'hover:bg-accent'}`}
                                >
                                  {updatingStatus === listing.id && getCurrentStatus(listing) !== 'rented' ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Circle className="h-4 w-4 fill-orange-500 text-orange-500" />
                                  )}
                                  <div className="flex flex-col">
                                    <span className="font-medium text-orange-700 dark:text-orange-400">Rented</span>
                                    <span className="text-xs text-muted-foreground">Hidden from users</span>
                                  </div>
                                  {getCurrentStatus(listing) === 'rented' && <span className="ml-auto">✓</span>}
                                </button>
                              <button
                                  disabled={updatingStatus === listing.id}
                                  onClick={() => handleStatusChange(listing.id, 'unavailable')}
                                  className={`w-full flex items-center gap-3 rounded-md px-3 py-3 text-left ${getCurrentStatus(listing) === 'unavailable' ? 'bg-gray-500/10' : 'hover:bg-accent'}`}
                                >
                                  {updatingStatus === listing.id && getCurrentStatus(listing) !== 'unavailable' ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Circle className="h-4 w-4 fill-gray-500 text-gray-500" />
                                  )}
                                  <div className="flex flex-col">
                                    <span className="font-medium text-gray-700 dark:text-gray-400">Unavailable</span>
                                    <span className="text-xs text-muted-foreground">Draft - Hidden</span>
                                  </div>
                                  {getCurrentStatus(listing) === 'unavailable' && <span className="ml-auto">✓</span>}
                                </button>

                              <div className="my-2 h-px bg-border" />

                              {/* Other actions */}
                              <SheetClose asChild>
                                <button
                                  onClick={() => navigate(`/property/${listing.id}`)}
                                  className="w-full flex items-center gap-3 rounded-md px-3 py-3 text-left hover:bg-accent"
                                >
                                  <Eye className="h-4 w-4" />
                                  <span>View</span>
                                </button>
                              </SheetClose>
                              <SheetClose asChild>
                                <button
                                  onClick={() => navigate(`/add-property?edit=${listing.id}`)}
                                  className="w-full flex items-center gap-3 rounded-md px-3 py-3 text-left hover:bg-accent"
                                >
                                  <Edit className="h-4 w-4" />
                                  <span>Edit</span>
                                </button>
                              </SheetClose>
                              <SheetClose asChild>
                                <button
                                  onClick={() => {
                                    console.log('🗑️ Delete button clicked for property:', listing.id, listing.title);
                                    setDeleteDialog(listing.id);
                                  }}
                                  className="w-full flex items-center gap-3 rounded-md px-3 py-3 text-left text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span>Delete</span>
                                </button>
                              </SheetClose>
                            </div>
                          </SheetContent>
                        </Sheet>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-label="Listing actions" variant="ghost" size="icon" style={{ touchAction: 'manipulation' }}>
                              <MoreVertical className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                            {/* Status Change Options */}
                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                              Change Status
                            </div>
                            <DropdownMenuItem
                              onSelect={() => handleStatusChange(listing.id, 'available')}
                              disabled={updatingStatus === listing.id}
                              className={getDisplayStatus(listing) === 'available' ? 'bg-green-500/10' : ''}
                            >
                              {updatingStatus === listing.id && getDisplayStatus(listing) !== 'available' ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Circle className="h-4 w-4 mr-2 fill-green-500 text-green-500" />
                              )}
                              <div className="flex flex-col flex-1">
                                <span className="font-medium text-green-700 dark:text-green-400">Available</span>
                                <span className="text-xs text-muted-foreground">Live - Visible to users</span>
                              </div>
                              {getDisplayStatus(listing) === 'available' && <span className="ml-2">✓</span>}
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem
                              onSelect={() => handleStatusChange(listing.id, 'rented')}
                              disabled={updatingStatus === listing.id}
                              className={getDisplayStatus(listing) === 'rented' ? 'bg-orange-500/10' : ''}
                            >
                              {updatingStatus === listing.id && getDisplayStatus(listing) !== 'rented' ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Circle className="h-4 w-4 mr-2 fill-orange-500 text-orange-500" />
                              )}
                              <div className="flex flex-col flex-1">
                                <span className="font-medium text-orange-700 dark:text-orange-400">Rented</span>
                                <span className="text-xs text-muted-foreground">Hidden from users</span>
                              </div>
                              {getDisplayStatus(listing) === 'rented' && <span className="ml-2">✓</span>}
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem
                              onSelect={() => handleStatusChange(listing.id, 'unavailable')}
                              disabled={updatingStatus === listing.id}
                              className={getDisplayStatus(listing) === 'unavailable' ? 'bg-gray-500/10' : ''}
                            >
                              {updatingStatus === listing.id && getDisplayStatus(listing) !== 'unavailable' ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Circle className="h-4 w-4 mr-2 fill-gray-500 text-gray-500" />
                              )}
                              <div className="flex flex-col flex-1">
                                <span className="font-medium text-gray-700 dark:text-gray-400">Unavailable</span>
                                <span className="text-xs text-muted-foreground">Draft - Hidden</span>
                              </div>
                              {getDisplayStatus(listing) === 'unavailable' && <span className="ml-2">✓</span>}
                            </DropdownMenuItem>
                            
                            <div className="my-1 h-px bg-border" />
                            
                            {/* Other Options */}
                            <DropdownMenuItem
                              onSelect={() => navigate(`/property/${listing.id}`)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => navigate(`/add-property?edit=${listing.id}`)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() => {
                                console.log('🗑️ Delete button clicked for property:', listing.id, listing.title);
                                setDeleteDialog(listing.id);
                              }}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
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
