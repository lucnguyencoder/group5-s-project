import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Tag,
  Calendar,
  Edit,
  X,
  Trash2,
  Package,
  ExternalLink,
  Trash2Icon,
  Pen,
  Info,
} from "lucide-react";
import { storeService } from "@/services/basicService";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import FoodCard from "../food/FoodCard";
import InformationTile from "@/components/common/InformationTile";
import { formatDateTime, formatTimeAgo } from "@/utils/formatter";
import { useUser } from "@/context/UserContext";
import PrivateComponents from "@/components/layout/PrivateComponents";

export function CategoryDetailsPanel({
  categoryId,
  onCategoryIdChange,
  onCategoryUpdated,
}) {
  const navigate = useNavigate();
  const [categoryDetails, setCategoryDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (categoryId) {
      fetchCategoryDetails(categoryId);
    } else {
      setCategoryDetails(null);
    }
  }, [categoryId]);

  const handleDeleteCategory = () => {
    setOpenConfirmDialog(true);
  };

  const fetchCategoryDetails = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await storeService.getCategoryById(id);
      console.log(response);
      if (response.success) {
        setCategoryDetails(response.category);
        setLoading(false);
      } else {
        setError(response.message || "Failed to load category details");
        setLoading(false);
      }
    } catch (err) {
      console.error("Failed to fetch category details:", err);
      setError("Could not load category details. Please try again later.");
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    setOpenConfirmDialog(false);
    try {
      const response = await storeService.deleteCategory(categoryId);
      if (response.success) {
        onCategoryIdChange(null);
        onCategoryUpdated();
        toast.success("Category deleted successfully");
      } else {
        toast.error(response.message || "Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error(
        "An error occurred while deleting the category. Please try again later."
      );
    }
  };

  const handleEditInPage = () => {
    navigate(`/menu/categories/update/${categoryId}`);
  };

  if (!categoryId) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center text-muted-foreground">
        <Tag className="h-12 w-12 mb-4 opacity-20" />
        <h3 className="text-lg font-medium mb-1">No Category Selected</h3>
        <p className="text-sm">Select a category to view details</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p>Loading category details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <p className="text-destructive mb-4">{error}</p>
        <Button
          variant="outline"
          onClick={() => fetchCategoryDetails(categoryId)}
        >
          Retry
        </Button>
      </div>
    );
  }

  if (!categoryDetails) return null;

  return (
    <>
      <Dialog open={openConfirmDialog} onOpenChange={setOpenConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this category?
            </DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenConfirmDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col h-full overflow-auto">
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Category Details</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCategoryIdChange(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-4 flex-1 overflow-auto">
          <p className="text-md font-semibold mb-2 mx-2">About</p>
          <div className="space-y-1 rounded-md overflow-hidden border border-card">
            <InformationTile
              icon={<Tag className="h-5 w-5 text-muted-foreground" />}
              title="Name"
              action={
                <span className="text-sm">{categoryDetails.category_name}</span>
              }
            />
            <InformationTile
              icon={<Info className="h-5 w-5 text-muted-foreground" />}
              title="Description"
              action={
                <span className="text-sm">{categoryDetails?.description}</span>
              }
            />
            <InformationTile
              icon={<Calendar className="h-5 w-5 text-muted-foreground" />}
              title="Last Updated"
              action={
                <span className="text-sm">
                  {formatDateTime(categoryDetails.updatedAt)}
                </span>
              }
            />
          </div>

          <p className="text-md font-semibold mb-2 mx-2 mt-4">
            Items ({categoryDetails.foods.length})
          </p>
          <div className="space-y-0.5 rounded-md overflow-hidden border border-card">
            {categoryDetails.foods &&
              categoryDetails.foods.length > 0 &&
              categoryDetails.foods.map((food) => (
                <FoodCard key={food.food_id} food={food} />
              ))}
          </div>

          {/* Empty state for foods */}
          {categoryDetails.foods && categoryDetails.foods.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No foods in this category yet</p>
            </div>
          )}
        </div>

        <div className="mt-auto p-2 flex items-center justify-between border-t">
          <p className="text-sm text-muted-foreground pl-2">
            Created {formatTimeAgo(categoryDetails.createdAt)}
          </p>

          <div className="flex justify-end gap-2">
            <PrivateComponents url="/api/store/categories/:id" method="DELETE">
              <Button
                variant="outline"
                onClick={handleDeleteCategory}
                size="sm"
              >
                <Trash2Icon className="h-4 w-4 mr-2" /> Delete
              </Button>
            </PrivateComponents>
            <PrivateComponents url="/api/store/categories/:id" method="PUT">
              <Button variant="outline" onClick={handleEditInPage} size="sm">
                <Pen className="h-4 w-4 mr-2" /> Edit
              </Button>
            </PrivateComponents>
          </div>
        </div>
      </div>
    </>
  );
}

export default CategoryDetailsPanel;
