import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Edit, Trash2, Eye, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
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
import apartmentImg from "@/assets/sample-apartment.jpg";
import houseImg from "@/assets/sample-house.jpg";

interface Listing {
  id: string;
  title: string;
  location: string;
  price: string;
  status: "active" | "pending" | "expired";
  views: number;
  inquiries: number;
  image: string;
  postedDate: string;
}

const mockListings: Listing[] = [
  {
    id: "1",
    title: "Luxury 3BHK Apartment in South Delhi",
    location: "Green Park, Delhi",
    price: "₹45,000",
    status: "active",
    views: 124,
    inquiries: 8,
    image: apartmentImg,
    postedDate: "2 days ago",
  },
  {
    id: "2",
    title: "Independent House with Garden",
    location: "Koramangala, Bangalore",
    price: "₹75,000",
    status: "pending",
    views: 0,
    inquiries: 0,
    image: houseImg,
    postedDate: "1 hour ago",
  },
];

const MyListings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [listings, setListings] = useState<Listing[]>(mockListings);
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setListings(listings.filter((l) => l.id !== id));
    setDeleteDialog(null);
    toast({
      title: "Listing Deleted",
      description: "Your property listing has been removed.",
    });
  };

  const getStatusBadge = (status: Listing["status"]) => {
    const variants = {
      active: "default",
      pending: "secondary",
      expired: "destructive",
    } as const;

    return (
      <Badge variant={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="sticky top-0 z-40 bg-background border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
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
                  {listings.length} active listings
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

      <div className="max-w-6xl mx-auto px-4 py-6">
        {listings.length > 0 ? (
          <div className="grid gap-4">
            {listings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-64 h-48 md:h-auto">
                    <img
                      src={listing.image}
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
                          {getStatusBadge(listing.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {listing.location}
                        </p>
                        <p className="text-xl font-bold text-primary">
                          {listing.price}
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
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => navigate(`/property/${listing.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
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
                        <p className="text-muted-foreground">Inquiries</p>
                        <p className="font-semibold">{listing.inquiries}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Posted</p>
                        <p className="font-semibold">{listing.postedDate}</p>
                      </div>
                    </div>

                    {listing.status === "pending" && (
                      <div className="mt-4 p-3 bg-secondary/10 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Your listing is under review and will be published
                          within 24 hours.
                        </p>
                      </div>
                    )}
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
              onClick={() => deleteDialog && handleDelete(deleteDialog)}
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
