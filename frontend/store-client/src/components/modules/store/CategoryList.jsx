"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Loader2, X, Search, Columns3Cog, RefreshCw, Edit } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { PaginationList } from "@/components/common/PaginationList";
import { cn } from "@/lib/utils";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useStore } from "@/context/StoreContext";
import { storeService } from "@/services/basicService";
import CategoryDetailsPanel from "./CategoryDetailsPanel";
import { Link } from "react-router-dom";

const columns = [
  {
    id: "category_id",
    label: "ID",
    render: ({ row }) => <div>{row.id}</div>,
  },
  {
    id: "category_name",
    label: "Category Name",
    render: ({ row }) => <div>{row.category_name}</div>,
  },
  {
    id: "description",
    label: "Description",
    render: ({ row }) => <div>{row.description || "Not provided yet"}</div>,
  },
  {
    id: "created_at",
    label: "Created At",
    render: ({ row }) => (
      <div>{new Date(row.createdAt).toLocaleDateString()}</div>
    ),
  },
  {
    id: "updated_at",
    label: "Updated At",
    render: ({ row }) => (
      <div>{new Date(row.updatedAt).toLocaleDateString()}</div>
    ),
  },
];

export function CategoryList() {
  const { store } = useStore();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [columnVisibility, setColumnVisibility] = useState(
    Object.fromEntries(columns.map((col) => [col.id, true]))
  );
  const [filters, setFilters] = useState({
    category_name: "",
  });
  const [searchValue, setSearchValue] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemPerPage: 10,
    totalPages: 1,
    totalCount: 0,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const fetchCategories = async (
    currentFilters = filters,
    page = pagination.currentPage,
    itemPerPage = pagination.itemPerPage
  ) => {
    if (!store?.id) return;
    try {
      setLoading(true);
      const apiFilters = {};
      if (currentFilters.category_name)
        apiFilters.category_name = currentFilters.category_name;

      const response = await storeService.getAllCategory(store.id, apiFilters, {
        page,
        itemPerPage,
      });
      if (response.success) {
        setCategories(response.categories);
        setPagination((prev) => ({
          ...prev,
          currentPage: response.currentPage || 1,
          itemPerPage: response.itemPerPage || prev.itemPerPage,
          totalPages: response.totalPage || 1,
          totalCount: response.totalCount || 0,
        }));
        setError(null);
      } else {
        setError(response.message || "Failed to load categories");
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchCategories();
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (store?.id) {
      fetchCategories();
    }
  }, [store?.id]);

  const handleFilters = (type, value) => {
    let newFilters = { ...filters };

    if (type === "category_name") {
      newFilters.category_name = value;
    } else if (type === "clear") {
      newFilters = { category_name: "" };
      setSearchValue("");
    }

    setFilters(newFilters);
    fetchCategories(newFilters);
  };

  const handleViewDetails = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  const handleRowClick = (categoryId, e) => {
    // Check if the click was on a button or any element inside a button
    if (e.target.closest("button")) {
      return;
    }
    setSelectedCategoryId(categoryId);
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

  if (!store || !store.id) {
    return (
      <div className="w-full p-8 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Đang tải thông tin cửa hàng...</span>
      </div>
    );
  }

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={65} minSize={40}>
        <div className="flex flex-col h-full">
          <div className="flex gap-2 items-center p-4 border-b">
            <Input
              placeholder="Filter by category name..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="h-8 text-xs pr-10"
              onKeyDown={(e) =>
                e.key === "Enter" && handleFilters("category_name", searchValue)
              }
            />
            <Button
              className="h-8 px-2 py-0"
              variant="outline"
              onClick={() => handleFilters("category_name", searchValue)}
            >
              <Search className="mr-1 h-4 w-4" />
              Search
            </Button>

            {filters.category_name && (
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
                  ) : categories.length ? (
                    categories.map((category) => (
                      <TableRow
                        key={category.id}
                        className={cn(
                          "h-14",
                          selectedCategoryId === category.id
                            ? "bg-primary/10 hover:bg-primary/20"
                            : "hover:bg-secondary/5",
                          "cursor-pointer"
                        )}
                        onClick={(e) => handleRowClick(category.id, e)}
                      >
                        {visibleColumns.map((column) => (
                          <TableCell key={column.id} className="px-6">
                            {column.render({
                              row: category,
                              onViewDetails: handleViewDetails,
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
                        No categories found.
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
                onValueChange={(value) =>
                  fetchCategories(filters, 1, Number(value))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 5, 10, 20, 50, 100].map((size) => (
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
              onPageChange={(page) => {
                console.log(pagination.currentPage);
                fetchCategories(filters, page, pagination.itemPerPage);
              }}
              disabled={loading}
            />
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={35} minSize={25}>
        <CategoryDetailsPanel
          categoryId={selectedCategoryId}
          onCategoryIdChange={setSelectedCategoryId}
          onCategoryUpdated={handleRefresh}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export default CategoryList;
