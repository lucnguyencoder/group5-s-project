import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  RefreshCw,
  ChevronDown,
  Loader2,
  X,
  Edit,
  Trash,
  DollarSign,
  Tag,
  Columns3Cog,
} from "lucide-react";
import { PaginationList } from "@/components/common/PaginationList";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { foodService } from "@/services/foodService";
import { useStore } from "@/context/StoreContext";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/formatter";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
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
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";
import PrivateComponents from "@/components/layout/PrivateComponents";

export function FoodTableList({ onFoodSelect, onEditFood }) {
  const { user } = useUser();
  const { store } = useStore();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFoodId, setSelectedFoodId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [foodToDelete, setFoodToDelete] = useState(null);

  const columns = [
    {
      id: "food_id",
      label: "ID",
      render: ({ row }) => <div>{row.food_id}</div>,
    },
    {
      id: "image",
      label: "Image",
      render: ({ row }) => (
        <div className="w-10 h-10 rounded-md overflow-hidden">
          <img
            src={row.image_url || "/placeholder-food.jpg"}
            alt={row.food_name}
            className="w-full h-full object-cover"
          />
        </div>
      ),
    },
    {
      id: "food_name",
      label: "Name",
      render: ({ row }) => <div className="font-medium">{row.food_name}</div>,
    },
    {
      id: "price",
      label: "Price",
      render: ({ row }) => (
        <div className="flex flex-col">
          {row.is_on_sale ? (
            <>
              <span className="line-through text-muted-foreground text-xs">
                {formatCurrency(row.base_price)}
              </span>
              <span className="text-green-600 font-medium text-md ">
                {formatCurrency(row?.sale_price || row.base_price)}
              </span>
            </>
          ) : (
            <span>{formatCurrency(row.base_price)}</span>
          )}
        </div>
      ),
    },
    {
      id: "preparation_time",
      label: "Prep Time",
      render: ({ row }) => <div>{row.preparation_time} min</div>,
    },
    {
      id: "status",
      label: "Status",
      render: ({ row }) => (
        <div className="flex items-center gap-1">
          {row.is_available ? (
            <Badge>Available</Badge>
          ) : (
            <Badge variant="secondary">Unavailable</Badge>
          )}
          {row.is_on_sale && (
            <Badge variant="destructive" className="ml-1">
              On Sale
            </Badge>
          )}
        </div>
      ),
    },
    {
      id: "actions",
      label: "Actions",
      render: ({ row, onEdit, onDelete }) => (
        <div className="flex gap-2 justify-start">
          <PrivateComponents url={`/api/store/foods/:foodId`} method="PUT">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(row.food_id);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </PrivateComponents>

          {/* <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(row.food_id);
          }}
        >
          <Trash className="h-4 w-4" />
        </Button> */}
        </div>
      ),
    },
  ];

  const [columnVisibility, setColumnVisibility] = useState(
    Object.fromEntries(columns.map((col) => [col.id, true]))
  );

  const [filters, setFilters] = useState({
    name: "",
    status: "",
    onSale: undefined,
  });

  const [searchValue, setSearchValue] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    itemPerPage: 10,
    totalPage: 1,
    totalPages: 1,
    totalCount: 0,
    currentPage: 1,
  });

  const [refreshing, setRefreshing] = useState(false);

  const fetchFoods = async (
    currentFilters = filters,
    page = pagination.page,
    itemPerPage = pagination.itemPerPage
  ) => {
    try {
      setLoading(true);
      const apiFilters = {};

      if (currentFilters.name) apiFilters.name = currentFilters.name;
      if (currentFilters.status) apiFilters.status = currentFilters.status;
      if (currentFilters.onSale !== undefined)
        apiFilters.onSale = currentFilters.onSale;

      let response = await foodService.getAllFoods(apiFilters, {
        page,
        itemPerPage,
      });
      if (response.success) {
        setFoods(response?.data.foods || []);
        setPagination({
          page: response?.data?.current_page || 1,
          currentPage: response?.data?.current_page || 1,
          itemPerPage: itemPerPage,
          totalPage:
            response?.data?.total ||
            Math.ceil(response?.data?.total / itemPerPage) ||
            1,
          totalPages:
            response?.data?.totalPages ||
            Math.ceil(response?.data?.total / itemPerPage) ||
            1,
          totalCount: response?.data?.totalCount || response.foods?.length || 0,
        });
        setError(null);
      } else {
        setError(response.message || "Failed to load foods");
      }
    } catch (err) {
      console.error("Error fetching foods:", err);
      setError("Failed to load foods. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchFoods();
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (store?.id) {
      fetchFoods();
    }
  }, [store?.id]);

  const handleFilters = (type, value) => {
    let newFilters = { ...filters };

    if (type === "status") {
      if (value === "available") newFilters.status = "available";
      else if (value === "unavailable") newFilters.status = "unavailable";
      else newFilters.status = "";
    } else if (type === "sale") {
      if (value === "on_sale") newFilters.onSale = true;
      else if (value === "not_on_sale") newFilters.onSale = false;
      else newFilters.onSale = undefined;
    } else if (type === "name") {
      newFilters.name = value;
    } else if (type === "clear") {
      newFilters = { name: "", status: "", onSale: undefined };
      setSearchValue("");
    }

    setFilters(newFilters);
    fetchFoods(newFilters);
  };

  const handleRowClick = (foodId) => {
    setSelectedFoodId(foodId);
    if (onFoodSelect) {
      onFoodSelect(foodId);
    }
  };

  const handleEdit = (foodId) => {
    if (onEditFood) {
      onEditFood(foodId);
    }
  };

  const handleDelete = (foodId) => {
    setFoodToDelete(foodId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!foodToDelete) return;

    console.log("Deleting food:", foodToDelete);

    try {
      const response = await foodService.deleteFood(foodToDelete);
      if (response.success) {
        toast.success("Food item deleted successfully");
        handleRefresh();
        if (selectedFoodId === foodToDelete) {
          setSelectedFoodId(null);
          if (onFoodSelect) {
            onFoodSelect(null);
          }
        }
      } else {
        toast.error(response.message || "Failed to delete food item");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the food item", error);
    } finally {
      setDeleteDialogOpen(false);
      setFoodToDelete(null);
    }
  };

  const visibleColumns = columns.filter((col) => columnVisibility[col.id]);

  if (error) {
    return (
      <div className="w-full p-8 text-center">
        <p>{error}</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Reload
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 items-center p-4 border-b">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              {filters.status === "available"
                ? "Available"
                : filters.status === "unavailable"
                ? "Unavailable"
                : "All Status"}
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleFilters("status", "all")}>
              All Status
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleFilters("status", "available")}
            >
              Available
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleFilters("status", "unavailable")}
            >
              Unavailable
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              {filters.onSale === true
                ? "On Sale"
                : filters.onSale === false
                ? "Regular Price"
                : "All Prices"}
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleFilters("sale", "all")}>
              All Prices
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilters("sale", "on_sale")}>
              On Sale
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleFilters("sale", "not_on_sale")}
            >
              Regular Price
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Input
          placeholder="Search by name..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="h-8 text-xs pr-10"
          onKeyDown={(e) =>
            e.key === "Enter" && handleFilters("name", searchValue)
          }
        />
        <Button
          className="h-8 px-2 py-0"
          variant="outline"
          onClick={() => handleFilters("name", searchValue)}
        >
          <Search className="mr-1 h-4 w-4" />
          Search
        </Button>

        {(filters.name || filters.status || filters.onSale !== undefined) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFilters("clear")}
            className="h-8 text-xs"
          >
            <X className="mr-1 h-4 w-4" />
            Clear
          </Button>
        )}

        <Button
          variant="outline"
          size="icon"
          className="h-8 text-xs ml-auto"
          onClick={handleRefresh}
          disabled={refreshing || loading}
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`}
          />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <Columns3Cog className="h-3.5 w-3.5 mr-1" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[150px]">
            {columns.map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize text-xs"
                checked={columnVisibility[column.id]}
                onCheckedChange={(value) =>
                  setColumnVisibility((prev) => ({
                    ...prev,
                    [column.id]: value,
                  }))
                }
              >
                {column.label || column.id}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto">
          <Table className="w-full">
            <TableHeader className="sticky top-0 bg-sidebar z-10">
              <TableRow>
                {visibleColumns.map((column) => (
                  <TableHead key={column.id} className="px-6 font-medium">
                    {column.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={visibleColumns.length}>
                    <div className="flex justify-center items-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <span className="ml-2">Please wait</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : foods.length ? (
                foods.map((food) => (
                  <TableRow
                    key={food.food_id}
                    className={cn(
                      "h-14",
                      !food.is_available && "opacity-60",
                      selectedFoodId === food.food_id
                        ? "bg-primary/10 hover:bg-primary/20"
                        : "hover:bg-secondary/5",
                      "cursor-pointer"
                    )}
                    onClick={() => handleRowClick(food.food_id)}
                  >
                    {visibleColumns.map((column) => (
                      <TableCell key={column.id} className="px-6">
                        {column.render({
                          row: food,
                          onEdit: handleEdit,
                          onDelete: handleDelete,
                        })}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={visibleColumns.length}
                    className="h-24 text-center"
                  >
                    No food items found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-between border-t">
        <div className="flex items-center space-x-2 p-1.5">
          <Select
            value={pagination.itemPerPage.toString()}
            onValueChange={(value) => fetchFoods(filters, 1, Number(value))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50, 100].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground text-nowrap">
            items per page
          </span>
        </div>

        <PaginationList
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={(page) =>
            fetchFoods(filters, page, pagination.itemPerPage)
          }
          disabled={loading}
        />
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this food item. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default FoodTableList;
