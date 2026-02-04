import { useStore } from "@/context/StoreContext";
import { storeService } from "@/services/basicService";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import FormTile from "@/components/common/FormTile";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowDown,
  ArrowUp,
  Minimize,
  Minus,
  Plus,
  Trash,
  Trash2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { formatCurrency } from "@/utils/formatter";
import { Separator } from "@/components/ui/separator";
export const StoreCustomization = () => {
  const [data, setData] = useState([]);
  const [category, setCategory] = useState([]);
  const { store } = useStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("create");
  const [categoryId, setCategoryId] = useState("");
  const [deleteId, setDeleteId] = useState({});
  const fetchCategory = async () => {
    try {
      const result = await storeService.getAllCategory(
        store?.id,
        {},
        { page: 1, itemPerPage: 1000 }
      );
      if (result.success) {
        const filterCategory = result.categories.filter(
          (c) => c.foods.length > 0
        );
        setCategory(filterCategory || []);
        console.log("Fetched categories:", result.categories);
      }
    } catch (error) {
      toast.error("Failed to load categories" + error);
    }
  };
  const fetchData = async () => {
    try {
      const result = await storeService.getCustomizations(store?.id);
      if (result.success) {
        setData(result.data || []);
        console.log("Fetched customizations:", result.data);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const filteredCategory = () => {
    return category?.filter((item) => {
      return !data?.some((d) => d.category_id === item.id);
    });
  };

  const updatePosition = async (changePos, currentPos, currentCategoryId) => {
    try {
      const newPos = parseInt(currentPos) + changePos;
      if (newPos < 1 || newPos > data.length) {
        return;
      }
      const dataAtNewPos = data.find(
        (item) =>
          item.position === newPos && item.category_id !== currentCategoryId
      );
      const dataAtCurrentPos = data.find(
        (item) =>
          item.position === currentPos && item.category_id === currentCategoryId
      );
      if (!dataAtNewPos || !dataAtCurrentPos) {
        toast.error("Invalid position update");
        return;
      }
      const updateDataAtNewPos = {
        ...dataAtNewPos,
        position: currentPos,
      };
      const updateDataAtCurrentPos = {
        ...dataAtCurrentPos,
        position: newPos,
      };
      await storeService.updateCustomization(updateDataAtNewPos);
      await storeService.updateCustomization(updateDataAtCurrentPos);
      fetchData();
    } catch (error) {
      console.error("Error updating position:", error);
      toast.error("Failed to update position: " + error.message);
    }
  };

  const addCustomization = async () => {
    try {
      const position = data.length > 0 ? data.length + 1 : 1;
      const customizationData = {
        store_id: store?.id,
        category_id: categoryId,
        position: position,
      };
      console.log("Creating customization with data:", customizationData);
      const result = await storeService.createCustomization(customizationData);
      if (result.success) {
        toast.success("Customization added successfully");
        setDialogOpen(false);
        fetchData();
      } else {
        toast.error("Failed to add customization: " + result.message);
      }
    } catch (error) {
      toast.error("Error adding customization: " + error.message);
    }
  };

  const deleteById = async () => {
    try {
      const result = await storeService.deleteCustomizationById(deleteId);
      if (result.success) {
        toast.success("Customization deleted successfully");
        setDialogOpen(false);
        fetchData();
      } else {
        toast.error("Failed to delete customization: " + result.message);
        setDialogOpen(false);
      }
    } catch (error) {
      toast.error("Error deleting customization: " + error.message);
      setDialogOpen(false);
    }
  };

  const deleteAllCustomizations = async () => {
    try {
      const result = await storeService.deleteAllCustomizations(store?.id);
      if (result.success) {
        toast.success("All customizations deleted successfully");
        setData([]);
        setCategory([]);
        fetchData();
        fetchCategory();
      } else {
        toast.error("Failed to delete all customizations: " + result.message);
      }
    } catch (error) {
      toast.error("Error deleting all customizations: " + error.message);
    } finally {
      setDialogOpen(false);
    }
  };
  useEffect(() => {
    fetchCategory();
    fetchData();
  }, [store?.id]);

  return (
    <>
      <div className="space-y-2 py-4 max-w-6xl mx-auto w-full">
        <div className="flex items-center justify-between px-2">
          <div>
            <p className="text-lg font-semibold pt-2">
              Customize your profile.
            </p>
            <p className="text-sm text-muted-foreground ">
              It will be displayed on the Featured's tab of your store.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setDialogOpen(true);
                setDialogType("create");
              }}
            >
              <Plus className="w-8 h-8 " />
              New Item
            </Button>

            <Button
              variant="destructive"
              onClick={() => {
                setDialogOpen(true);
                setDialogType("deleteAll");
              }}
            >
              <Trash2 />
              Clear All
            </Button>
          </div>
        </div>
        <div className="space-y-0 rounded-lg border border-card overflow-hidden w-full">
          {data.length > 0 ? (
            data.map((item, index) => (
              <>
                <FormTile
                  title={<p className="text-md font-semibold">{item.category?.category_name}</p>}
                  description={item.category?.description}
                  rounded={false}
                  action={
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => {
                          setDialogOpen(true);
                          setDeleteId({
                            ...deleteById,
                            store_id: store?.id,
                            category_id: item.category?.id,
                          });
                          setDialogType("Delete");
                        }}
                        variant={"outline"}
                        size="icon"
                      >
                        <Minus />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          updatePosition(-1, item.position, item.category?.id)
                        }
                      >
                        <ArrowUp />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          updatePosition(1, item.position, item.category?.id)
                        }
                      >
                        <ArrowDown />
                      </Button>
                    </div>
                  }
                  isExpanded={true}
                  expand={
                    <>
                      <div className="-ml-8">
                        {/* <h1 className="text-2xl">
                          {item.category?.category_name}
                        </h1> */}
                        <ScrollArea>
                          <div className="flex flex-row gap-2">
                            {item?.category?.foods.map((food) => (
                              <div
                                key={food.id}
                                className="p-2 last:border-b-0"
                              >
                                <img
                                  src={food.image_url}
                                  alt={food.food_name}
                                  className="h-30 object-cover rounded-md"
                                />
                                <h2 className="text-lg font-semibold">
                                  {food.food_name}
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                  {food.is_on_sale
                                    ? formatCurrency(food.sale_price)
                                    : formatCurrency(food.base_price)}
                                </p>
                              </div>
                            ))}
                          </div>
                          <ScrollBar
                            orientation="horizontal"
                            className="w-full"
                          />
                        </ScrollArea>
                      </div>
                    </>
                  }
                />
                {index < data.length - 1 && (
                  <Separator className={"opacity-50"} />
                )}
              </>
            ))
          ) : (
            <div className="p-12 text-center text-sm text-muted-foreground">
              No customizations found. Click "New Item" to create one.
            </div>
          )}
        </div>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogType === "Delete" || dialogType === "deleteAll"
                ? "Delete Customization"
                : "Create Customization"}
            </DialogTitle>
            <DialogDescription>
              Modify your customization settings here.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-col">
              {dialogType === "Delete" || dialogType === "deleteAll" ? (
                <p className="text-sm text-red-500">
                  Are you sure you want to delete{" "}
                  {dialogType === "deleteAll"
                    ? "all customizations"
                    : "this customization"}
                  ? This action cannot be undone.
                </p>
              ) : (
                <>
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    onValueChange={(value) => {
                      setCategoryId(value);
                      console.log("Selected category ID:", value);
                    }}
                  >
                    <SelectTrigger className={"w-full mt-3"}>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredCategory().map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.category_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Close
            </Button>
            {dialogType === "Delete" || dialogType === "deleteAll" ? (
              <Button
                variant="destructive"
                onClick={
                  dialogType === "deleteAll"
                    ? deleteAllCustomizations
                    : deleteById
                }
              >
                Delete
              </Button>
            ) : (
              <Button onClick={addCustomization}>Save</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
