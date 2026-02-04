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
  Columns3Cog,
  Truck,
  ShoppingBag,
  Users,
  Eye,
  EyeOff,
} from "lucide-react";
import { PaginationList } from "@/components/common/PaginationList";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/context/StoreContext";
import { cn } from "@/lib/utils";
import { formatCurrency, formatString } from "@/utils/formatter";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { discountService } from "@/services/discountService";

const columns = [
  {
    id: "discount_id",
    label: "ID",
    render: ({ row }) => <div>{row.discount_id}</div>,
  },
  {
    id: "code",
    label: "Code",
    render: ({ row }) => <div className="font-medium">{row.code}</div>,
  },
  {
    id: "discount_name",
    label: "Name",
    render: ({ row }) => <div>{row.discount_name}</div>,
  },
  {
    id: "discount_type",
    label: "Type",
    render: ({ row }) => (
      <p className="capitalize">{formatString(row.discount_type)}</p>
    ),
  },
  {
    id: "discount_value",
    label: "Value",
    render: ({ row }) => (
      <div className="text-right">
        {row.discount_type === "fixed_amount"
          ? formatCurrency(row.discount_value)
          : `${row.discount_value}%`}
      </div>
    ),
  },
  {
    id: "visibility",
    label: "Visibility",
    render: ({ row }) => (
      <div className="flex items-center justify-start gap-2">
        {row.is_hidden ? (
          <>
            <EyeOff className="h-4 w-4 text-muted-foreground" />{" "}
            <span className="text-muted-foreground">Hidden</span>
          </>
        ) : (
          <>
            <Eye className="h-4 w-4" /> <span>Public</span>
          </>
        )}
      </div>
    ),
  },
  {
    id: "discount_sale_type",
    label: "Discount To",
    render: ({ row }) => (
      <div className="text-right">
        {row.discount_sale_type === "items" ? (
          <div className="flex items-center justify-start gap-2">
            <ShoppingBag className="h-4 w-4" /> Items
          </div>
        ) : (
          <div className="flex items-center justify-start gap-2">
            <Truck className="h-4 w-4" /> Delivery
          </div>
        )}
      </div>
    ),
  },
  {
    id: "user_limit",
    label: "User Limit",
    render: ({ row }) => (
      <div>
        {row.is_limit_usage_per_user ? (
          <div className="flex items-center justify-start gap-2">
            <Users className="h-4 w-4" /> {row.allow_usage_per_user} per user
          </div>
        ) : (
          <span className="text-muted-foreground">No limit per user</span>
        )}
      </div>
    ),
  },
  {
    id: "valid_from",
    label: "Valid From",
    render: ({ row }) => (
      <div>{new Date(row.valid_from).toLocaleDateString()}</div>
    ),
  },
  {
    id: "valid_to",
    label: "Valid To",
    render: ({ row }) => (
      <div>{new Date(row.valid_to).toLocaleDateString()}</div>
    ),
  },
  {
    id: "is_active",
    label: "Status",
    render: ({ row }) => (
      <Badge variant={row.is_active ? "success" : "destructive"}>
        {row.is_active ? "Active" : "Inactive"}
      </Badge>
    ),
  },
];

function DiscountTableList({
  selectedDiscount,
  setSelectedDiscount,
  refreshKey,
}) {
  const { store } = useStore();
  const [discounts, setDiscounts] = useState([]);
  const [filteredDiscounts, setFilteredDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [columnVisibility, setColumnVisibility] = useState(
    Object.fromEntries(columns.map((col) => [col.id, true]))
  );

  const [filters, setFilters] = useState({
    search: "",
    isActive: undefined,
  });

  const [searchValue, setSearchValue] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    itemPerPage: 10,
    totalPages: 1,
    totalCount: 0,
  });

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      setError(null);
      setRefreshing(true);

      const response = await discountService.getAllDiscounts();
      if (response.success) {
        setDiscounts(response.data || []);
        applyFilters(response.data || [], filters);
      } else {
        setError(response.message || "Failed to load discounts");
      }
    } catch (err) {
      console.error("Error fetching discounts:", err);
      setError("Failed to load discounts. Please try again later.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const applyFilters = (discountList, currentFilters) => {
    let filtered = [...discountList];

    if (currentFilters.search) {
      const searchTerm = currentFilters.search.toLowerCase();
      filtered = filtered.filter(
        (discount) =>
          discount.code.toLowerCase().includes(searchTerm) ||
          discount.discount_name.toLowerCase().includes(searchTerm) ||
          discount.description.toLowerCase().includes(searchTerm)
      );
    }

    if (currentFilters.isActive !== undefined) {
      filtered = filtered.filter(
        (discount) => discount.is_active === currentFilters.isActive
      );
    }

    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / pagination.itemPerPage);

    setPagination((prev) => ({
      ...prev,
      totalPages,
      totalCount,
      page: prev.page > totalPages ? 1 : prev.page,
    }));

    const startIndex = (pagination.page - 1) * pagination.itemPerPage;
    const paginatedDiscounts = filtered.slice(
      startIndex,
      startIndex + pagination.itemPerPage
    );

    setFilteredDiscounts(paginatedDiscounts);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchDiscounts();
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (store?.id) {
      fetchDiscounts();
    }
  }, [store?.id, refreshKey]);

  useEffect(() => {
    applyFilters(discounts, filters);
  }, [filters, pagination.page, pagination.itemPerPage]);

  const handleFilters = (type, value) => {
    let newFilters = { ...filters };

    if (type === "status") {
      if (value === "active") newFilters.isActive = true;
      else if (value === "inactive") newFilters.isActive = false;
      else newFilters.isActive = undefined;
    } else if (type === "search") {
      newFilters.search = value;
    } else if (type === "clear") {
      newFilters = { search: "", isActive: undefined };
      setSearchValue("");
    }

    setFilters(newFilters);
  };

  const handleRowClick = (discountId) => {
    setSelectedDiscount(discountId);
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
              {filters.isActive === true
                ? "Active"
                : filters.isActive === false
                ? "Inactive"
                : "All Status"}
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleFilters("status", "all")}>
              All Status
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilters("status", "active")}>
              Active
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleFilters("status", "inactive")}
            >
              Inactive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Input
          placeholder="Search discounts..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="h-8 text-xs pr-10"
          onKeyDown={(e) =>
            e.key === "Enter" && handleFilters("search", searchValue)
          }
        />
        <Button
          className="h-8 px-2 py-0"
          variant="outline"
          onClick={() => handleFilters("search", searchValue)}
        >
          <Search className="mr-1 h-4 w-4" />
          Search
        </Button>

        {(filters.search || filters.isActive !== undefined) && (
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
              ) : filteredDiscounts.length ? (
                filteredDiscounts.map((discount) => (
                  <TableRow
                    key={discount.discount_id}
                    className={cn(
                      "h-14",
                      !discount.is_active && "opacity-60",
                      selectedDiscount === discount.discount_id
                        ? "bg-primary/10 hover:bg-primary/20"
                        : "hover:bg-secondary/5",
                      "cursor-pointer"
                    )}
                    onClick={() => handleRowClick(discount.discount_id)}
                  >
                    {visibleColumns.map((column) => (
                      <TableCell key={column.id} className="px-6">
                        {column.render({ row: discount })}
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
                    No discounts found.
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
            onValueChange={(value) => {
              setPagination((prev) => ({
                ...prev,
                itemPerPage: Number(value),
                page: 1,
              }));
            }}
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
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={(page) => {
            setPagination((prev) => ({
              ...prev,
              page,
            }));
          }}
          disabled={loading}
        />
      </div>
    </div>
  );
}

export default DiscountTableList;
