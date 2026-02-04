"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import {
  ChevronDown,
  CheckCircle,
  XCircle,
  Loader2,
  X,
  Eye,
  Search,
  Store,
  MapPin,
  Star,
  Phone,
  Mail,
  Clock8,
  RefreshCw,
  Columns3Cog,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import storeManagementService from "@/services/store/storeManagementService";
import { StoresStatusDialog } from "./StoresStatusDialog";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaginationList } from "@/components/common/PaginationList";
import { toast } from "sonner";

const columns = [
  {
    id: "id",
    label: "ID",
    render: ({ row }) => <div>{row.id}</div>,
  },
  {
    id: "name",
    label: "Store Name",
    render: ({ row }) => (
      <div className="flex items-center">
        {row.avatar_url ? (
          <img
            src={row.avatar_url}
            alt={row.name}
            className="h-8 w-8 rounded-full mr-2 object-cover"
          />
        ) : (
          <Store className="h-8 w-8 rounded-full mr-2 p-1 border" />
        )}
        <span className="font-medium">{row.name}</span>
      </div>
    ),
  },
  {
    id: "address",
    label: "Address",
    render: ({ row }) => (
      <div className="flex items-center">
        <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
        <span className="truncate max-w-[200px]">{row.address}</span>
      </div>
    ),
  },
  {
    id: "phone",
    label: "Phone",
    render: ({ row }) => (
      <div className="flex items-center">
        <Phone className="h-4 w-4 mr-1 text-muted-foreground" />
        <span>{row.phone}</span>
      </div>
    ),
  },
  {
    id: "email",
    label: "Email",
    render: ({ row }) => (
      <div className="flex items-center">
        <Mail className="h-4 w-4 mr-1 text-muted-foreground" />
        <span className="truncate max-w-[200px]">{row.email}</span>
      </div>
    ),
  },
  {
    id: "hours",
    label: "Operating Hours",
    render: ({ row }) => {
      const opening = row.opening_time?.substring(0, 5) || "N/A";
      const closing = row.closing_time?.substring(0, 5) || "N/A";
      return (
        <div className="flex items-center">
          <Clock8 className="h-4 w-4 mr-1 text-muted-foreground" />
          <span>
            {opening} - {closing}
          </span>
        </div>
      );
    },
  },
  {
    id: "rating",
    label: "Rating",
    render: ({ row }) => (
      <div className="flex items-center">
        <Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500" />
        <span>
          {row.rating} ({row.total_reviews})
        </span>
      </div>
    ),
  },
  {
    id: "status",
    label: "Status",
    render: ({ row }) => {
      const status = row.status;
      const isActive = row.isActive;
      const isTempClosed = row.isTempClosed;

      let badgeVariant = "outline";
      let statusText = status;

      if (!isActive) {
        badgeVariant = "destructive";
        statusText = "Disable";
      } else if (isTempClosed) {
        badgeVariant = "warning";
        statusText = "Temp. Closed";
      } else if (status === "active") {
        badgeVariant = "success";
        statusText = "Active";
      }

      return (
        <Badge variant={badgeVariant} className="capitalize">
          {statusText}
        </Badge>
      );
    },
  },
  {
    id: "created_at",
    label: "Created At",
    render: ({ row }) => (
      <div>{new Date(row.created_at).toLocaleDateString()}</div>
    ),
  },
  {
    id: "actions",
    label: "Actions",
    render: ({ row }) => (
      <div className="flex items-center space-x-2">
        <Link to={`/store/${row.id}`}>
          <Button variant="outline" size="xs" className="text-xs px-2 py-1">
            <Eye className="mr-1 h-4 w-4" /> Details
          </Button>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="xs" className="text-xs px-2 py-1">
              Actions
              <ChevronDown className="ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(row.id.toString())}
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <StoresStatusDialog
              id={row.id}
              name={row.name}
              isActive={row.isActive}
              isTempClosed={row.isTempClosed}
              type="status"
              onStatusChange={() => window.location.reload()}
            >
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                {row.isActive ? "Disable Store" : "Activate Store"}
              </DropdownMenuItem>
            </StoresStatusDialog>
            <StoresStatusDialog
              id={row.id}
              name={row.name}
              isActive={row.isActive}
              isTempClosed={row.isTempClosed}
              type="temp"
              onStatusChange={() => window.location.reload()}
            >
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                {row.isTempClosed
                  ? "Reopen Store"
                  : "Mark as Temporarily Closed"}
              </DropdownMenuItem>
            </StoresStatusDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];

export function StoresDataTable() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [columnVisibility, setColumnVisibility] = useState(
    Object.fromEntries(columns.map((col) => [col.id, true]))
  );
  const [filters, setFilters] = useState({
    name: "",
    address: "",
    status: "",
    isActive: undefined,
    isTempClosed: undefined,
  });
  const [searchValue, setSearchValue] = useState("");
  const [searchField, setSearchField] = useState("name");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemPerPage: 10,
    totalPages: 1,
    totalCount: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  const fetchStores = async (
    currentFilters = filters,
    page = pagination.currentPage,
    itemPerPage = pagination.itemPerPage
  ) => {
    try {
      setLoading(true);

      const apiFilters = {};
      if (currentFilters.name) apiFilters.name = currentFilters.name;
      if (currentFilters.address) apiFilters.address = currentFilters.address;
      if (currentFilters.status) apiFilters.status = currentFilters.status;
      if (currentFilters.isActive !== undefined)
        apiFilters.isActive = currentFilters.isActive;
      if (currentFilters.isTempClosed !== undefined)
        apiFilters.isTempClosed = currentFilters.isTempClosed;

      const response = await storeManagementService.getAllStores(apiFilters, {
        page,
        itemPerPage,
      });
      if (response.success) {
        setStores(response.data);
        setPagination(response.pagination);
        setError(null);
      }
      else {
        toast.error(response.message || "Failed to load stores");
        setError(response.message || "Failed to load stores");
      }
    } catch (err) {
      console.error("Error fetching stores:", err);
      setError("Failed to load stores. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleStatusFilter = (value) => {
    let newFilters = { ...filters };

    if (value === "active") {
      newFilters = {
        ...filters,
        status: "active",
        isActive: true,
        isTempClosed: false,
      };
    } else if (value === "temp-closed") {
      newFilters = {
        ...filters,
        status: "active",
        isActive: true,
        isTempClosed: true,
      };
    } else if (value === "disable") {
      newFilters = {
        ...filters,
        status: "",
        isActive: false,
        isTempClosed: undefined,
      };
    } else {
      newFilters = {
        ...filters,
        status: "",
        isActive: undefined,
        isTempClosed: undefined,
      };
    }

    setFilters(newFilters);
    fetchStores(newFilters);
  };

  const handleSearch = () => {
    if (!searchValue.trim()) return;

    const newFilters = { ...filters };

    newFilters.name = "";
    newFilters.address = "";

    if (searchField === "name") {
      newFilters.name = searchValue;
    } else if (searchField === "address") {
      newFilters.address = searchValue;
    }

    setFilters(newFilters);
    fetchStores(newFilters);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchStores(filters);
    } catch (error) {
      console.error("Error refreshing stores:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleClearFilters = () => {
    const emptyFilters = {
      name: "",
      address: "",
      status: "",
      isActive: undefined,
      isTempClosed: undefined,
    };
    setFilters(emptyFilters);
    setSearchValue("");
    fetchStores(emptyFilters);
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
    <div className="w-full">
      <div className="flex flex-col gap-2 mb-2">
        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs">
                {filters.isActive === true && filters.isTempClosed === true
                  ? "Temporarily Closed"
                  : filters.isActive === true && filters.isTempClosed === false
                    ? "Active"
                    : filters.isActive === false
                      ? "Disable"
                      : "All Statuses"}
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleStatusFilter("all")}>
                All Statuses
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusFilter("active")}>
                Active
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusFilter("temp-closed")}
              >
                Temporarily Closed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusFilter("disable")}>
                Disable
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex-1 relative">
            <div className="flex">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs rounded-r-none border-r-0"
                  >
                    {searchField === "name" ? "Name" : "Address"}
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => setSearchField("name")}>
                    Name
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSearchField("address")}>
                    Address
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Input
                placeholder={`Search by ${searchField}...`}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="h-8 text-xs rounded-l-none flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
              <Button
                className="absolute right-0 top-0 h-full px-2"
                variant="ghost"
                onClick={handleSearch}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

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
                Columns
                <ChevronDown className="ml-1 h-4 w-4" />
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

        {(filters.name ||
          filters.address ||
          filters.status ||
          filters.isActive !== undefined ||
          filters.isTempClosed !== undefined) && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className="h-8 text-xs self-start"
            >
              <X className="h-4 w-4 mr-1" />
              Clear filters
            </Button>
          )}
      </div>

      <div className="rounded-md border bg-sidebar">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              {visibleColumns.map((column) => (
                <TableHead key={column.id} className=" font-medium">
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={visibleColumns.length} className="h-24">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2">Loading stores...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : stores.length ? (
              stores.map((store) => (
                <TableRow
                  key={store.id}
                  className={`h-14 ${!store.isActive ? "opacity-60" : ""}`}
                >
                  {visibleColumns.map((column) => (
                    <TableCell key={column.id} className="">
                      {column.render({
                        row: store,
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
                  No stores found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between py-4">
        <div className="flex items-center space-x-2">
          <Select
            value={pagination.itemPerPage.toString()}
            onValueChange={(value) => fetchStores(filters, 1, Number(value))}
          >
            <SelectTrigger className="max-h-8">
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
            fetchStores(filters, page, pagination.itemPerPage)
          }
          disabled={loading}
        />
      </div>
    </div>
  );
}

export default StoresDataTable;
